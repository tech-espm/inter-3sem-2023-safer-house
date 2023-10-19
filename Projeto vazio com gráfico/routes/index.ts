import app = require("teem");

class IndexRoute {
	public async index(req: app.Request, res: app.Response) {
		let hoje = new Date();

		let mes = hoje.getMonth() + 1;
		let dia = hoje.getDate();

		let opcoes = {
			ano: hoje.getFullYear(),
			mes: (mes < 10 ? "0" + mes : mes),
			dia: (dia < 10 ? "0" + dia : dia)
		};

		res.render("index/index", opcoes);
	}

	public async sobre(req: app.Request, res: app.Response) {
		let opcoes = {
			titulo: "Sobre"
		};

		res.render("index/sobre", opcoes);
	}

	public async obterDados(req: app.Request, res: app.Response) {
		let dados = [
			{ dia: "10/09", valor: 80 },
			{ dia: "11/09", valor: 92 },
			{ dia: "12/09", valor: 90 },
			{ dia: "13/09", valor: 101 },
			{ dia: "14/09", valor: 105 },
			{ dia: "15/09", valor: 100 },
			{ dia: "16/09", valor: 64 },
			{ dia: "17/09", valor: 78 },
			{ dia: "18/09", valor: 93 },
			{ dia: "19/09", valor: 110 }
		];

		res.json(dados);
	}
}

export = IndexRoute;
