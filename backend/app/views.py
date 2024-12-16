import random
from datetime import datetime, timedelta

from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import *


def get_draft_decree():
    return Decree.objects.filter(status=1).first()


def get_user():
    return User.objects.filter(is_superuser=False).first()


def get_moderator():
    return User.objects.filter(is_superuser=True).first()


@api_view(["GET"])
def search_units(request):
    unit_name = request.GET.get("unit_name", "")

    units = Unit.objects.filter(status=1)

    if unit_name:
        units = units.filter(name__icontains=unit_name)

    serializer = UnitsSerializer(units, many=True)
    
    draft_decree = get_draft_decree()

    resp = {
        "units": serializer.data,
        "units_count": UnitDecree.objects.filter(decree=draft_decree).count() if draft_decree else None,
        "draft_decree": draft_decree.pk if draft_decree else None
    }

    return Response(resp)


@api_view(["GET"])
def get_unit_by_id(request, unit_id):
    if not Unit.objects.filter(pk=unit_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    unit = Unit.objects.get(pk=unit_id)
    serializer = UnitSerializer(unit)

    return Response(serializer.data)


@api_view(["PUT"])
def update_unit(request, unit_id):
    if not Unit.objects.filter(pk=unit_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    unit = Unit.objects.get(pk=unit_id)

    serializer = UnitSerializer(unit, data=request.data, partial=True)

    if serializer.is_valid(raise_exception=True):
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def create_unit(request):
    serializer = UnitSerializer(data=request.data, partial=False)

    serializer.is_valid(raise_exception=True)

    Unit.objects.create(**serializer.validated_data)

    units = Unit.objects.filter(status=1)
    serializer = UnitSerializer(units, many=True)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_unit(request, unit_id):
    if not Unit.objects.filter(pk=unit_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    unit = Unit.objects.get(pk=unit_id)
    unit.status = 2
    unit.save()

    units = Unit.objects.filter(status=1)
    serializer = UnitSerializer(units, many=True)

    return Response(serializer.data)


@api_view(["POST"])
def add_unit_to_decree(request, unit_id):
    if not Unit.objects.filter(pk=unit_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    unit = Unit.objects.get(pk=unit_id)

    draft_decree = get_draft_decree()

    if draft_decree is None:
        draft_decree = Decree.objects.create()
        draft_decree.owner = get_user()
        draft_decree.date_created = timezone.now()
        draft_decree.save()

    if UnitDecree.objects.filter(decree=draft_decree, unit=unit).exists():
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
    item = UnitDecree.objects.create()
    item.decree = draft_decree
    item.unit = unit
    item.save()

    serializer = DecreeSerializer(draft_decree)
    return Response(serializer.data["units"])


@api_view(["POST"])
def update_unit_image(request, unit_id):
    if not Unit.objects.filter(pk=unit_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    unit = Unit.objects.get(pk=unit_id)

    image = request.data.get("image")
    if image is not None:
        unit.image = image
        unit.save()

    serializer = UnitSerializer(unit)

    return Response(serializer.data)


@api_view(["GET"])
def search_decrees(request):
    status = int(request.GET.get("status", 0))
    date_formation_start = request.GET.get("date_formation_start")
    date_formation_end = request.GET.get("date_formation_end")

    decrees = Decree.objects.exclude(status__in=[1, 5])

    if status > 0:
        decrees = decrees.filter(status=status)

    if date_formation_start and parse_datetime(date_formation_start):
        decrees = decrees.filter(date_formation__gte=parse_datetime(date_formation_start))

    if date_formation_end and parse_datetime(date_formation_end):
        decrees = decrees.filter(date_formation__lt=parse_datetime(date_formation_end))

    serializer = DecreesSerializer(decrees, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def get_decree_by_id(request, decree_id):
    if not Decree.objects.filter(pk=decree_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    decree = Decree.objects.get(pk=decree_id)
    serializer = DecreeSerializer(decree, many=False)

    return Response(serializer.data)


@api_view(["PUT"])
def update_decree(request, decree_id):
    if not Decree.objects.filter(pk=decree_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    decree = Decree.objects.get(pk=decree_id)
    serializer = DecreeSerializer(decree, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PUT"])
def update_status_user(request, decree_id):
    if not Decree.objects.filter(pk=decree_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    decree = Decree.objects.get(pk=decree_id)

    if decree.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    decree.status = 2
    decree.date_formation = timezone.now()
    decree.save()

    serializer = DecreeSerializer(decree, many=False)

    return Response(serializer.data)


def random_date():
    now = datetime.now(tz=timezone.utc)
    return now + timedelta(random.uniform(-1, 0) * 100)


@api_view(["PUT"])
def update_status_admin(request, decree_id):
    if not Decree.objects.filter(pk=decree_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    request_status = int(request.data["status"])

    if request_status not in [3, 4]:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    decree = Decree.objects.get(pk=decree_id)

    if decree.status != 2:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    if request_status == 3:
        decree.date = random_date()

    decree.date_complete = timezone.now()
    decree.status = request_status
    decree.moderator = get_moderator()
    decree.save()

    return Response(status=status.HTTP_200_OK)


@api_view(["DELETE"])
def delete_decree(request, decree_id):
    if not Decree.objects.filter(pk=decree_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    decree = Decree.objects.get(pk=decree_id)

    if decree.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    decree.status = 5
    decree.save()

    serializer = DecreeSerializer(decree, many=False)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_unit_from_decree(request, decree_id, unit_id):
    if not UnitDecree.objects.filter(decree_id=decree_id, unit_id=unit_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = UnitDecree.objects.get(decree_id=decree_id, unit_id=unit_id)
    item.delete()

    items = UnitDecree.objects.filter(decree_id=decree_id)
    data = [UnitItemSerializer(item.unit, context={"meeting": item.meeting}).data for item in items]

    return Response(data, status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_unit_in_decree(request, decree_id, unit_id):
    if not UnitDecree.objects.filter(unit_id=unit_id, decree_id=decree_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = UnitDecree.objects.get(unit_id=unit_id, decree_id=decree_id)

    serializer = UnitDecreeSerializer(item, data=request.data,  partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    user = serializer.save()

    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def login(request):
    serializer = UserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(**serializer.data)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout(request):
    return Response(status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_user(request, user_id):
    if not User.objects.filter(pk=user_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = User.objects.get(pk=user_id)
    serializer = UserSerializer(user, data=request.data, partial=True)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    serializer.save()

    return Response(serializer.data)