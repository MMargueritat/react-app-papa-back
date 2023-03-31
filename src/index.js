const mysql = require("mysql");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8080;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "AdminAdmin33",
});

app.get("/show_patient_nomP", (req, res) => {
  db.query(
    "SELECT ID_Patient, Nom, Prenom, DATE_FORMAT(Date_Naissance, '%d/%m/%Y') as Date_Naissance FROM bddMyApp.patient order by Nom, Prenom, Date_Naissance",
    function (err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
});

app.get("/recup_calendrier_matin", (req, res) => {
  db.query(
    "SELECT bddMyApp.Soins.ID_Patient, bddMyApp.Patient.Prenom, bddMyApp.Patient.Nom FROM bddMyApp.Soins, bddMyApp.Patient WHERE bddMyApp.Patient.ID_Patient = bddMyApp.Soins.ID_Patient and '2023-04-05' BETWEEN bddMyApp.Soins.Date_Debut AND bddMyApp.Soins.Date_Fin and bddMyApp.Soins.matin = 1",
    function (err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
});

app.get("/recup_calendrier_journee", (req, res) => {
  db.query(
    "SELECT bddMyApp.Soins.ID_Patient, bddMyApp.Patient.Prenom, bddMyApp.Patient.Nom FROM bddMyApp.Soins, bddMyApp.Patient WHERE bddMyApp.Patient.ID_Patient = bddMyApp.Soins.ID_Patient and '2023-04-05' BETWEEN bddMyApp.Soins.Date_Debut AND bddMyApp.Soins.Date_Fin and bddMyApp.Soins.journee = 1",
    function (err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
});

app.get("/recup_calendrier_soir", (req, res) => {
  db.query(
    "SELECT bddMyApp.Soins.ID_Patient, bddMyApp.Patient.Prenom, bddMyApp.Patient.Nom FROM bddMyApp.Soins, bddMyApp.Patient WHERE bddMyApp.Patient.ID_Patient = bddMyApp.Soins.ID_Patient and '2023-04-05' BETWEEN bddMyApp.Soins.Date_Debut AND bddMyApp.Soins.Date_Fin and bddMyApp.Soins.soir = 1",
    function (err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
});

app.get("/show_listeSoin", (req, res) => {
  db.query(
    "SELECT ID_ListeSoin, libelSoin FROM bddMyApp.listeSoin order by libelSoin",
    function (err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
});

app.get("/show_patients", (req, res) => {
  db.query(
    "SELECT ID_Patient, Nom, Prenom, DATE_FORMAT(Date_Naissance, '%d/%m/%Y') as Date_Naissance, Sexe, Num_Tel, Adresse, Commentaire FROM bddMyApp.patient order by Nom, Prenom, Date_Naissance",
    function (err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
});

app.get("/show_soins", (req, res) => {
  db.query(
    "SELECT bddMyApp.Soins.ID_Soin, bddMyApp.Patient.Nom, bddMyApp.Patient.Prenom, DATE_FORMAT(bddMyApp.Soins.Date_Debut, '%d/%m/%Y') as Date_Debut, DATE_FORMAT(bddMyApp.Soins.Date_Fin, '%d/%m/%Y') as Date_Fin, bddMyApp.listeSoin.libelSoin as Soin, bddMyApp.Soins.Matin, bddMyApp.Soins.Journee, bddMyApp.Soins.Soir, bddMyApp.Soins.Commentaire from bddMyApp.Soins, bddMyApp.Patient, bddMyApp.listeSoin where bddMyApp.Soins.ID_Patient = bddMyApp.Patient.ID_Patient and bddMyApp.listeSoin.ID_ListeSoin = bddMyApp.Soins.soin order by bddMyApp.Soins.ID_Soin desc",
    function (err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
});

app.post("/add", (req, res) => {
  const { body } = req;
  const {
    nom_patient,
    prenom_patient,
    date_naissance_patient,
    sexe_patient,
    numTel_patient,
    adresse_patient,
    commentaire_patient,
  } = body;
  db.query(
    `insert into bddMyApp.patient (Nom, Prenom, Date_Naissance, Sexe, Num_Tel, Adresse, Commentaire) VALUES ("${nom_patient}", "${prenom_patient}", STR_TO_DATE("${date_naissance_patient}", "%d/%m/%Y"), "${sexe_patient}", "${numTel_patient}","${adresse_patient}", "${commentaire_patient}")`,
    function (err, result) {
      if (err) throw err;
    }
  );
});

app.post("/addSoin", (req, res) => {
  const { body } = req;
  const {
    nom_patient,
    dateDeb_soin,
    dateFin_soin,
    soin,
    commentaire_soin,
    checkboxes,
  } = body;
  console.log(checkboxes);
  db.query(
    `insert into bddMyApp.soins (id_patient, Date_debut, Date_fin, Soin, Matin, Journee, Soir, Commentaire) VALUES ("${nom_patient}", STR_TO_DATE("${dateDeb_soin}", "%d/%m/%Y"), STR_TO_DATE("${dateFin_soin}", "%d/%m/%Y"), "${soin}", ${checkboxes[0]}, ${checkboxes[1]}, ${checkboxes[2]}, "${commentaire_soin}")`,
    function (err, result) {
      if (err) throw err;
    }
  );
});
