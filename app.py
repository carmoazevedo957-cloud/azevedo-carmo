from pathlib import Path

from flask import Flask, render_template, send_from_directory


BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__)

JOGOS = [
    {
        "id": "tabuada",
        "titulo": "Helicoptero da Tabuada",
        "desc": "A tabuada de antigamente, com contas caindo e tempo para responder.",
        "materia": "Matematica",
        "capa": "🧮",
        "arquivo": "tabuada_antiga.py",
    },
    {
        "id": "saudacoes",
        "titulo": "Flashcards - Saudacoes",
        "desc": "Modo prova: PT -> EN, digite em ingles e aperte ENTER.",
        "materia": "Ingles",
        "capa": "🇧🇷🇺🇸",
        "arquivo": "prova_saudacoes.py",
    },
    {
        "id": "gincana",
        "titulo": "Gincana Historia Geral",
        "desc": "Equipe AZUL x VERMELHA, 15 segundos para responder.",
        "materia": "Historia",
        "capa": "🏛️",
        "arquivo": "gincana_historia.py",
    },
]


@app.route("/")
def home():
    return render_template("index.html", jogos=JOGOS)


@app.route("/download/<path:nome_arquivo>")
def download(nome_arquivo):
    return send_from_directory(BASE_DIR / "jogos", nome_arquivo, as_attachment=True)


@app.route("/sobre")
def sobre():
    return render_template("sobre.html")


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)
