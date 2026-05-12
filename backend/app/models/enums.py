from enum import Enum


class SigninType(str, Enum):
    LOCAL = "LOCAL"
    OAUTH = "OAUTH"


class OAuthProvider(str, Enum):
    KAKAO = "KAKAO"
    NAVER = "NAVER"
    GOOGLE = "GOOGLE"


class MemberType(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class TransactionType(str, Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"


class CategoryType(str, Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"


class EventType(str, Enum):
    ANALYSIS = "ANALYSIS"
    MY = "MY"
    FEATURE = "FEATURE"
    SUBSCRIPTION = "SUBSCRIPTION"
    PAYMENT = "PAYMENT"


class PostType(str, Enum):
    COMMON = "COMMON"
    INFORMATION = "INFORMATION"
    NOTIFICATION = "NOTIFICATION"
