import React, { useState, useEffect, useRef } from "react";

const CameraComFiltro = () => {
  const [fotoFinal, setFotoFinal] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const inputFileRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    };
    setIsMobile(checkMobile());
  }, []);

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
      const hole = { x: 110, y: 730, width: 375, height: 475 };

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

      // Converte imagem desenhada em preto e branco com contraste
      const imageData = ctx.getImageData(hole.x, hole.y, hole.width, hole.height);
      const data = imageData.data;
      const contrast = 1; // ajuste o valor para mais ou menos contraste

      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]; // luminância
        let adjusted = (avg - 128) * contrast + 128;
        adjusted = Math.max(0, Math.min(255, adjusted));
        data[i] = data[i + 1] = data[i + 2] = adjusted;
      }

      ctx.putImageData(imageData, hole.x, hole.y);

      const moldura = new Image();
      moldura.src = process.env.PUBLIC_URL + "/pic.png";
      moldura.onload = () => {
        ctx.drawImage(moldura, 0, 0, canvas.width, canvas.height);
        const fotoMesclada = canvas.toDataURL("image/png");
        setFotoFinal(fotoMesclada);
      };
    };
  };

  const compartilharNoStory = () => {
    // Força download da imagem
    const link = document.createElement("a");
    link.href = fotoFinal;
    link.download = "foto-com-filtro.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Tenta abrir Instagram no celular
    const urlScheme = "instagram://story-camera";
    const newWindow = window.open(urlScheme, "_blank");

    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      alert("Abra o Instagram no seu celular e poste a foto manualmente.");
    }
  };

  if (fotoFinal) {
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

        {/* Só mostra o botão se for mobile */}
        {isMobile && (
          <button
            onClick={compartilharNoStory}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "10px 0",
              fontWeight: "bold",
              fontSize: 16,
              backgroundColor: "#f4c531",
              color: "#1c1c1c",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Compartilhar no Story
          </button>
        )}

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

        <button
          onClick={() => setFotoFinal(null)}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "10px 0",
            fontWeight: "bold",
            fontSize: 16,
            backgroundColor: "#444",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Escolher outra foto
        </button>
      </div>
    );
  }

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
      <p style={{ marginTop: 1 }}>Veja como ficará sua foto:</p>
      <img
        src={process.env.PUBLIC_URL + "/pic.png"}
        alt="Exemplo da moldura"
        style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={uploadImagem}
        ref={inputFileRef}
        style={{ display: "none" }}
      />

      <button
        onClick={() => inputFileRef.current && inputFileRef.current.click()}
        style={{
          width: "100%",
          padding: "10px 0",
          fontWeight: "bold",
          fontSize: 16,
          backgroundColor: "#f4c531",
          color: "#1c1c1c",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Escolher imagem
      </button>
    </div>
  );
};

export default CameraComFiltro;