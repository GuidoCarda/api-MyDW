const x: number = 42;

const y: string = "50";

const res: string = x + y;

type ning = string | number;

const sample: ning = "hello";

interface Person {
    age?: number;
    name: string;
    birthDate: Date;
}

interface PersonExtended1 extends Person {
    birthPlace: string;
}

const personSample: Person = {
    age: 30,
    name: "John Doe",
    birthDate: new Date("1990-01-01"),
};

type Persons = {   
    age?: number;
    name: string;
    birthDate: Date;
} | null;

type PersonExtended = Persons & {
    birthPlace: string;
};

type PersonShortened = Omit<Person, 'birthDate'>;

type PersonPartial = Partial<Person>;

type PersonPick = Pick<Person, 'name' | 'age'>;

const personExtendedSample: PersonExtended1 = {
    age: 30,
    name: "John Doe",
    birthDate: new Date("1990-01-01"),
    birthPlace: "New York"
};

enum UserRole {
    ADMIN = "admin",
    USER = "user",
    GUEST = "guest",
    SUPER_ADMIN = "super_admin"
}

interface Client {
    userName: string;
    password: string;
    role: UserRole;
}

const clientSample: Client = {
    userName: "johndoe",
    password: "securepassword",
    role: UserRole.ADMIN
};

type MyFunction = (a: string, b: number) => string;

const functionSample: MyFunction = (a, b) => {
    return a + b;
}