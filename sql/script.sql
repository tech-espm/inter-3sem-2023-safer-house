CREATE DATABASE IF NOT EXISTS inter DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE inter;

CREATE TABLE pessoa (
  id_pessoa  int NOT NULL AUTO_INCREMENT,
  nome varchar(100) NOT NULL,
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

-- Movimentações por dia
SELECT count(data) total, entrada, date(data) dt, date_format(data, '%d/%m') dia
FROM log
WHERE data BETWEEN '2023-11-01 00:00:00' AND '2023-11-30 23:59:59'
GROUP BY entrada, dt, dia
ORDER BY dt, entrada;

-- Total por dia e pessoa
SELECT count(data) total, entrada, date(data) dt, date_format(data, '%d/%m') dia
FROM log
WHERE id_pessoa = 1 AND data BETWEEN '2023-11-01 00:00:00' AND '2023-11-30 23:59:59'
GROUP BY entrada, dt, dia
ORDER BY dt, entrada;
