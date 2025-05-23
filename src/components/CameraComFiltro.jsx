import React, { useState } from "react";

const CameraComFiltro = () => {
  const [fotoFinal, setFotoFinal] = useState(null);

  const uploadImagem = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    gerarFotoFinal(url);
  };

  const gerarFotoFinal = (src) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const hole = { x: 110, y: 750, width: 375, height: 475 };

      const imgAspect = img.width / img.height;
      const holeAspect = hole.width / hole.height;

      let drawWidth, drawHeight;

      if (imgAspect > holeAspect) {
        drawHeight = hole.height;
        drawWidth = drawHeight * imgAspect;
      } else {
        drawWidth = hole.width;
        drawHeight = drawWidth / imgAspect;
      }

      const drawX = hole.x + (hole.width - drawWidth) / 2;
      const drawY = hole.y + (hole.height - drawHeight) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(hole.x, hole.y, hole.width, hole.height);
      ctx.clip();
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      const moldura = new Image();
      moldura.src = process.env.PUBLIC_URL + "/pic.png";
      moldura.onload = () => {
        ctx.drawImage(moldura, 0, 0, canvas.width, canvas.height);
        const fotoMesclada = canvas.toDataURL("image/png");
        setFotoFinal(fotoMesclada);
      };
    };
  };

  // TELA DE RESULTADO
  if (fotoFinal) {
    const instagramUser = "expoexample"; // trocar para o @ da exposição

    const compartilharNoStory = () => {
      // Tenta abrir o app Instagram Stories no mobile com esquema URI (não garante upload da imagem)
      const urlScheme = `instagram://story-camera`;
      // Link web para abrir Instagram com o usuário marcado no perfil
      const webLink = `https://www.instagram.com/stories/create/story/?source_url=${encodeURIComponent(fotoFinal)}`;

      // Tenta abrir o app (funciona no mobile com Instagram instalado)
      window.open(urlScheme, "_blank") || window.open(webLink, "_blank");
    };

    return (
      <div
        style={{
          maxWidth: 360,
          margin: "0 auto",
          backgroundColor: "black",
          color: "white",
          padding: 10,
          textAlign: "center",
        }}
      >
        <img
          src={fotoFinal}
          alt="Foto final"
          style={{ width: "100%", borderRadius: 8 }}
        />

        <button
          onClick={compartilharNoStory}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "10px 0",
            fontWeight: "bold",
            fontSize: 16,
            backgroundColor: "#E1306C", // cor do Instagram
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Compartilhar no Story
        </button>

        <a
          href={fotoFinal}
          download="foto-com-filtro.png"
          style={{
            display: "block",
            marginTop: 10,
            padding: 10,
            backgroundColor: "white",
            color: "black",
            borderRadius: 8,
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Baixar Foto
        </a>
      </div>
    );
  }

  // TELA INICIAL
  return (
    <div
      style={{
        maxWidth: 360,
        margin: "0 auto",
        backgroundColor: "black",
        color: "white",
        padding: 10,
        textAlign: "center",
      }}
    >
      <p style={{ marginBottom: 8 }}>Veja como ficará sua foto:</p>
      <img
        src={process.env.PUBLIC_URL + "/pic.png"}
        alt="Exemplo da moldura"
        style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={uploadImagem}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default CameraComFiltro;