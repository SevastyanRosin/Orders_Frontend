from django.conf import settings
from django.core.management.base import BaseCommand
from minio import Minio

from .utils import *
from app.models import *


def add_users():
    User.objects.create_user("user", "user@user.com", "1234", first_name="user", last_name="user")
    User.objects.create_superuser("root", "root@root.com", "1234", first_name="root", last_name="root")

    for i in range(1, 10):
        User.objects.create_user(f"user{i}", f"user{i}@user.com", "1234", first_name=f"user{i}", last_name=f"user{i}")
        User.objects.create_superuser(f"root{i}", f"root{i}@root.com", "1234", first_name=f"user{i}", last_name=f"user{i}")


def add_units():
    Unit.objects.create(
        name="Отдел безопасности и охраны",
        description="• Обеспечение надежной защиты объектов филиала от краж, хищений, грабежей, других преступных посягательств и общественных беспорядков;\n• Обеспечение инженерно-технической защиты Филиала;\n• Обеспечение на охраняемых объектах контрольно-пропускного и внутриобъектового режима, предупреждение и пресечение хищений материальных ценностей;\n• Пресечение попыток несанкционированного проникновения на объекты филиала посторонних лиц;\n• Установление порядка допуска сотрудников сторонних организаций, посетителей и транспортных средств на охраняемую территорию;",
        phone="8 904 815 31 92",
        image="1.png"
    )

    Unit.objects.create(
        name="Ученый совет",
        description="• Рассмотрение вопросов текущей деятельности и развития Филиала в целях обеспечения высокого качества подготовки выпускников;\n• Методическое руководство и координация деятельности Филиала в сфере: учебной работы, научно-исследовательской работы, кадровой и административной работы, социальной работы.",
        phone="8 914 825 51 52",
        image="2.png"
    )

    Unit.objects.create(
        name="Отдел инженерной эксплуатации",
        description="• Поддержка учебных корпусов, зданий общежитий в состоянии, обеспечивающем их долголетнюю и надежную работу. Для этого подразделение проводит техническую эксплуатацию зданий, профилактику их конструкций, осуществляет проведение текущего ремонта зданий, поддерживать инженерные системы в учебных корпусах и зданиях общежитий в состоянии, обеспечивающем их долголетнюю и надежную работу.\n• Поддержка электротехнических систем в учебных корпусах и зданиях общежитий в состоянии, обеспечивающем их долголетнюю и надежную работу. Для этого подразделение проводит их техническую эксплуатацию и профилактику конструкций, узлов оборудования и приборов.",
        phone="8 753 215 35 11",
        image="3.png"
    )

    Unit.objects.create(
        name="Отдел научной и инновационной деятельности",
        description="• Координация, организационно-методическая поддержка и контроль выполнения по веществам отраслей НИОКР с целью создания образцов машин, оборудования, материалов, новых технологических процессов, решения важных социальных и экологических задач, совершенствования организации труда и управления.\n• Организация проведения фундаментальных исследований по Программам федерального и регионального правительств, направленных на инновационное развитие Калужского региона.\n• Организация научных, технологических, организационных, финансовых и коммерческих мероприятий, направленных на коммерциализацию накопленных знаний, технологий и оборудования.\n• Содействие повышению качества подготовки специалистов и научно-педагогических кадров, росту квалификации профессорско-преподавательского состава филиала.\n• Организация учета, анализа и оформления результатов научно-технической деятельности Филиала, создание базы данных научно-технических достижений.",
        phone="8 324 315 41 32",
        image="4.png"
    )

    Unit.objects.create(
        name="Бухгалтерия",
        description="• Исполнение «Учётной политики Университета в соответствии с законодательством о бухгалтерском и налоговом учёте, обеспечивая финансовую устойчивость филиала;\n• Учёт имущества, обязательств и хозяйственных операций, поступающих основных средств, товарно-материальных ценностей, денежных средств;\n• Начисление и выплата в установленные сроки зарплаты, стипендий, пособий и других выплат;\n• Своевременное проведение расчетов с юридическими и физическими лицами; уплата всех видов налогов и сборов;\n• Ведение учёта федеральных средств, целевых поступлений, доходов и расходов по средствам, полученных от иных источников;\n•",
        phone="8 544 835 47 48",
        image="5.png"
    )

    Unit.objects.create(
        name="Юридический отдел",
        description="• осуществление единого исполнения функциональных обязанностей юридической службы в деятельности структурных подразделений Филиала под непосредственным его руководством;\n• обеспечение правовой безопасности образовательной, научной, международной, финансово-хозяйственной и других видов уставной деятельности, осуществляемых Филиалом;\n• методологическое обеспечение правовой работы в деятельности Филиала;\n• организация эффективного использования и учета недвижимого имущества, в том числе путем сдачи его в аренду;",
        phone="8 334 515 32 80",
        image="6.png"
    )

    client = Minio(settings.MINIO_ENDPOINT,
                   settings.MINIO_ACCESS_KEY,
                   settings.MINIO_SECRET_KEY,
                   secure=settings.MINIO_USE_HTTPS)

    for i in range(1, 7):
        client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, f'{i}.png', f"app/static/images/{i}.png")

    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'default.png', "app/static/images/default.png")


def add_decrees():
    users = User.objects.filter(is_staff=False)
    moderators = User.objects.filter(is_staff=True)
    units = Unit.objects.all()

    for _ in range(30):
        status = random.randint(2, 5)
        owner = random.choice(users)
        add_decree(status, units, owner, moderators)

    add_decree(1, units, users[0], moderators)
    add_decree(2, units, users[0], moderators)
    add_decree(3, units, users[0], moderators)
    add_decree(4, units, users[0], moderators)
    add_decree(5, units, users[0], moderators)


def add_decree(status, units, owner, moderators):
    decree = Decree.objects.create()
    decree.status = status

    if status in [3, 4]:
        decree.moderator = random.choice(moderators)
        decree.date_complete = random_date()
        decree.date_formation = decree.date_complete - random_timedelta()
        decree.date_created = decree.date_formation - random_timedelta()
    else:
        decree.date_formation = random_date()
        decree.date_created = decree.date_formation - random_timedelta()

    if status == 3:
        decree.date = random_date()

    decree.name = "Название приказа"
    decree.description = "Описание приказа"

    decree.owner = owner

    for unit in random.sample(list(units), 3):
        item = UnitDecree(
            decree=decree,
            unit=unit,
            meeting=random.randint(0, 1)
        )
        item.save()

    decree.save()


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        add_users()
        add_units()
        add_decrees()
