
CREATE DATABASE IF NOT EXISTS inter DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE inter;

CREATE TABLE pessoa (
  id_pessoa  int NOT NULL AUTO_INCREMENT,
  nome varchar(20) NOT NULL,
  PRIMARY KEY (id_pessoa)
);

CREATE TABLE log (
  id_log int NOT NULL AUTO_INCREMENT,
  id_pessoa int NOT NULL,
  entrada tinyint NOT NULL,
  data datetime NOT NULL,
  PRIMARY KEY (id_log),
  INDEX id_pessoa_ix (id_pessoa, data),
  INDEX data_ix (data),
  CONSTRAINT log_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoa (id_pessoa)
);
