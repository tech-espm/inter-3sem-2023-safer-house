import app = require("teem");



class IndexRoute {
	public async index(req: app.Request, res: app.Response) {
		let hoje = new Date();

		let mesFinal = hoje.getMonth() + 1;
		let diaFinal = hoje.getDate();

		let semanaPassada = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);

		let mesInicial = semanaPassada.getMonth() + 1;
		let diaInicial = semanaPassada.getDate();

		let opcoes = {
			anoInicial: semanaPassada.getFullYear(),
			mesInicial: (mesInicial < 10 ? "0" + mesInicial : mesInicial),
			diaInicial: (diaInicial < 10 ? "0" + diaInicial : diaInicial),

			anoFinal: hoje.getFullYear(),
			mesFinal: (mesFinal < 10 ? "0" + mesFinal : mesFinal),
			diaFinal: (diaFinal < 10 ? "0" + diaFinal : diaFinal)
		};

		res.render("index/index", opcoes);
	}

	public async pessoas(req: app.Request, res: app.Response) {
		let pessoas: any[];
		await app.sql.connect(async (sql) => {
			pessoas = await sql.query(`
				SELECT id_pessoa, nome
				FROM pessoa
				ORDER BY nome;
			`);
		});
	
		let hoje = new Date();

		let mesFinal = hoje.getMonth() + 1;
		let diaFinal = hoje.getDate();

		let semanaPassada = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);

		let mesInicial = semanaPassada.getMonth() + 1;
		let diaInicial = semanaPassada.getDate();

		let opcoes = {
			titulo: "Relatório por Pessoas",
			pessoas: pessoas,

			anoInicial: semanaPassada.getFullYear(),
			mesInicial: (mesInicial < 10 ? "0" + mesInicial : mesInicial),
			diaInicial: (diaInicial < 10 ? "0" + diaInicial : diaInicial),

			anoFinal: hoje.getFullYear(),
			mesFinal: (mesFinal < 10 ? "0" + mesFinal : mesFinal),
			diaFinal: (diaFinal < 10 ? "0" + diaFinal : diaFinal)
		};

		res.render("index/pessoas", opcoes);
	}

	public async sobre(req: app.Request, res: app.Response) {
		let opcoes = {
			titulo: "Sobre"
		};

		res.render("index/sobre", opcoes);
	}
	public async historia(req: app.Request, res: app.Response) {
		let opcoes = {
			titulo: "Nossa trajetória"
		};

		res.render("index/historia", opcoes);
	}

	public async obterDados(req: app.Request, res: app.Response) {
		let dados: any[];

		if (!req.query["dataInicial"] || !req.query["dataFinal"]) {
			res.status(400).json("Informe a data inicial e final");
			return;
		}

		let dataInicial = req.query["dataInicial"] + " 00:00:00";
		let dataFinal = req.query["dataFinal"] + " 23:59:59";

		let id_pessoa = req.query["id_pessoa"];
		if (id_pessoa) {
			await app.sql.connect(async (sql) => {
				dados = await sql.query(`
					SELECT count(data) total, entrada, date(data) dt, date_format(data, '%d/%m') dia
					FROM log
					WHERE id_pessoa = ? AND data BETWEEN ? AND ?
					GROUP BY entrada, dt, dia
					ORDER BY dt, entrada;
				`, [ id_pessoa, dataInicial, dataFinal ]);
			});
		} else {
			await app.sql.connect(async (sql) => {
				dados = await sql.query(`
					SELECT count(data) total, entrada, date(data) dt, date_format(data, '%d/%m') dia
					FROM log
					WHERE data BETWEEN ? AND ?
					GROUP BY entrada, dt, dia
					ORDER BY dt, entrada;
				`, [ dataInicial, dataFinal ]);
			});
		}

		res.json(dados);
	}

	@app.http.post()
	public async logar(req: app.Request, res: app.Response) {
		let id_pessoa = parseInt(req.body["id_pessoa"] as string);
		let entrada = parseInt(req.body["entrada"] as string);

		if (!id_pessoa || (entrada != 0 && entrada != 1)) {
			res.status(400).json("Dados inválidos");
			return;
		}

		await app.sql.connect(async (sql) => {
			await sql.query(`
				INSERT INTO log (id_pessoa, entrada, data)
				VALUES (?, ?, now());
			`, [ id_pessoa, entrada ]);
		});

		res.json(true);
	}
}

export = IndexRoute;
