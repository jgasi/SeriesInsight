BEGIN;
CREATE TABLE "Serija"(
  "TMDB_id_serije" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(200) NOT NULL,
  "opis" TEXT NOT NULL,
  "broj_sezona" INTEGER NOT NULL,
  "broj_epizoda" INTEGER NOT NULL,
  "popularnost" FLOAT NOT NULL,
  "slika" TEXT NOT NULL,
  "poveznica" VARCHAR(500) NOT NULL
);

CREATE TABLE "Sezona"(
  "id_sezona" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(200) NOT NULL,
  "opis" TEXT NOT NULL,
  "broj_epizoda" INTEGER NOT NULL,
  "slika" TEXT NOT NULL,
  "serija_id" INTEGER NOT NULL,
  CONSTRAINT "fk_Sezona_Serija1"
    FOREIGN KEY("serija_id")
    REFERENCES "Serija"("TMDB_id_serije")
);

CREATE INDEX "fk_Sezona_Serija1_idx" ON "Sezona" ("serija_id");
CREATE TABLE "Tip_korisnika"(
  "id_tip_korisnika" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "uloga" VARCHAR(50) NOT NULL,
  "opis" TEXT
);

CREATE TABLE "Korisnik"(
  "id_korisnik" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "korime" VARCHAR(100) NOT NULL,
  "ime" VARCHAR(50),
  "prezime" VARCHAR(100),
  "email" VARCHAR(100) NOT NULL,
  "lozinka" VARCHAR(1000) NOT NULL,
  "adresa" VARCHAR(200),
  "drzava" VARCHAR(100),
  "telefon" VARCHAR(50),
  "tip_korisnika_id" INTEGER NOT NULL,
  "TOTPkljuc" VARCHAR(100),
  "dvorazinskaAutentifikacija" BOOLEAN,
  "prikazanKljuc" BOOLEAN,
  CONSTRAINT "korime_UNIQUE"
    UNIQUE("korime"),
  CONSTRAINT "email_UNIQUE"
    UNIQUE("email"),
  CONSTRAINT "fk_Korisnik_Tip_korisnika1"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "Tip_korisnika"("id_tip_korisnika")
);

CREATE INDEX "fk_Korisnik_Tip_korisnika1_idx" ON "Korisnik" ("tip_korisnika_id");

CREATE TABLE "Dnevnik"(
  "id_dnevnik" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "datum" DATE NOT NULL,
  "vrijeme" TIME NOT NULL,
  "vrsta_zahtjeva" VARCHAR(45) NOT NULL,
  "trazeni_resurs" VARCHAR(200) NOT NULL,
  "tijelo_zahtjeva" VARCHAR(200),
  "korisnik_id" INTEGER NOT NULL,
  CONSTRAINT "fk_Dnevnik_Korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "Korisnik"("id_korisnik")
);

CREATE INDEX "fk_Dnevnik_Korisnik1_idx" ON "Dnevnik" ("korisnik_id");

CREATE TABLE "Favorit"(
  "korisnik_id" INTEGER NOT NULL,
  "serija_id" INTEGER NOT NULL,
  PRIMARY KEY("korisnik_id","serija_id"),
  CONSTRAINT "fk_Favorit_Korisnik"
    FOREIGN KEY("korisnik_id")
    REFERENCES "Korisnik"("id_korisnik"),
  CONSTRAINT "fk_Favorit_Serija1"
    FOREIGN KEY("serija_id")
    REFERENCES "Serija"("TMDB_id_serije")
);

CREATE INDEX "fk_Favorit_Korisnik_idx" ON "Favorit" ("korisnik_id");
CREATE INDEX "fk_Favorit_Serija1_idx" ON "Favorit" ("serija_id");
COMMIT;

INSERT INTO "Tip_korisnika" ("uloga", "opis") VALUES ('korisnik', 'Običan korisnik');

INSERT INTO "Tip_korisnika" ("uloga", "opis") VALUES ('admin', 'Administrator');

INSERT INTO "Tip_korisnika" ("uloga", "opis") VALUES ('gost', 'Gost korisnik');


INSERT INTO "Korisnik" (
  "korime",
  "ime",
  "prezime",
  "email",
  "lozinka",
  "adresa",
  "drzava",
  "telefon",
  "tip_korisnika_id",
  "dvorazinskaAutentifikacija",
  "prikazanKljuc"
) VALUES (
  'obican',
  'Obican',
  'Korisnik',
  'obicankorisnik@gmail.com',
  '2317c5cc4e67b0cb5f55b26fdcf5fe0a24012503ae99d22b26f3c866d281be2b',
  'izmisljena adresa 1',
  'Hrvatska',
  '0986548329',
  1,
  0,
  0
);

INSERT INTO "Korisnik" (
  "korime",
  "ime",
  "prezime",
  "email",
  "lozinka",
  "adresa",
  "drzava",
  "telefon",
  "tip_korisnika_id",
  "dvorazinskaAutentifikacija",
  "prikazanKljuc"
) VALUES (
  'admin',
  'Admin',
  'Administrator',
  'administrator@gmail.com',
  '2317c5cc4e67b0cb5f55b26fdcf5fe0a24012503ae99d22b26f3c866d281be2b',
  'izmisljena adresa 2',
  'Hrvatska',
  '0986548344',
  2,
  0,
  0
);
