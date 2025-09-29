document.addEventListener("DOMContentLoaded", () => {
  // Seçiciler
  const startBtn = document.getElementById("starts");
  const buttonsDiv = document.getElementById("buttons");
  const message = document.getElementById("message");
  const tasBtn = document.getElementById("tas");
  const kagitBtn = document.getElementById("kagit");
  const makasBtn = document.getElementById("makas");
  const userChoiceDiv = document.getElementById("user-choice");
  const computerChoiceDiv = document.getElementById("computer-choice");

  let oyuncuSkor = 0;
  let rakipSkor = 0;
  let hedefSkor = 3;

  // Başlat butonu
  startBtn.addEventListener("click", () => {
    const input = prompt("Hedef skor kaç olsun? (Örn: 3, 5, 10)", "3");
    if (input && !isNaN(input)) hedefSkor = parseInt(input);

    buttonsDiv.style.display = "flex";
    startBtn.style.display = "none";
    message.innerText = `Hedef skor: ${hedefSkor} 🏆\nSeçimini yap! 🧐`;
  });

  // Bilgisayar seçimi
  function bilgisayarSecimi() {
    const secenekler = ["tas", "kagit", "makas"];
    return secenekler[Math.floor(Math.random() * secenekler.length)];
  }

  // Hamleyi daire içinde göster
  function hamleGoster(div, hamle) {
    if (!div) return;
    div.innerHTML = "";
    const img = document.createElement("img");
    img.src = `görseller/${hamle}.svg`;
    img.alt = hamle;
    div.appendChild(img);
  }

  // Kazanan/ kaybeden vurgusu
  function clearHighlights() {
    [userChoiceDiv, computerChoiceDiv].forEach(d => d?.classList.remove("winner", "loser"));
  }
  function highlightWinner(winner) {
    clearHighlights();
    if (winner === "user") {
      userChoiceDiv?.classList.add("winner");
      computerChoiceDiv?.classList.add("loser");
    } else if (winner === "comp") {
      computerChoiceDiv?.classList.add("winner");
      userChoiceDiv?.classList.add("loser");
    }
  }

  // Konfeti efekti
  function konfetiAt() {
    const colors = ["#ff0a54","#ff477e","#ff7096","#ff85a1","#fbb1b1","#00f5d4","#00d9f5","#ffa500","#ffff00"];
    for (let i = 0; i < 200; i++) {
      const konfeti = document.createElement("div");
      konfeti.style.position = "fixed";
      konfeti.style.width = konfeti.style.height = Math.random() * 10 + 5 + "px";
      konfeti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      konfeti.style.top = "-20px";
      konfeti.style.left = Math.random() * window.innerWidth + "px";
      konfeti.style.borderRadius = "50%";
      konfeti.style.opacity = Math.random() * 0.8 + 0.2;
      konfeti.style.pointerEvents = "none";
      konfeti.style.zIndex = 9999;
      konfeti.style.transition = `transform ${2 + Math.random() * 2}s linear, rotate ${2 + Math.random() * 2}s linear`;
      document.body.appendChild(konfeti);
      const randomX = (Math.random() - 0.5) * 300;
      const randomRotate = Math.random() * 720;
      const randomDelay = Math.random() * 500;
      setTimeout(() => konfeti.style.transform = `translate(${randomX}px, ${window.innerHeight + 50}px) rotate(${randomRotate}deg)`, randomDelay);
      setTimeout(() => konfeti.remove(), 4000);
    }
  }

  // Oyunun ana fonksiyonu (geri sayım ve buton devre dışı)
  function oyun(oyuncu) {
    if (oyuncuSkor >= hedefSkor || rakipSkor >= hedefSkor) return;

    const rakip = bilgisayarSecimi();
    hamleGoster(userChoiceDiv, oyuncu);

    if (computerChoiceDiv) computerChoiceDiv.innerHTML = "";

    // ⏳ Geri sayım sırasında butonları devre dışı bırak
    tasBtn.disabled = true;
    kagitBtn.disabled = true;
    makasBtn.disabled = true;

    let countdown = 3;
    message.innerText = `Bilgisayar düşünüyor... ⏳ ${countdown}`;

    const interval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        message.innerText = `Bilgisayar düşünüyor... ⏳ ${countdown}`;
      } else {
        clearInterval(interval);

        // Bilgisayarın hamlesini göster
        hamleGoster(computerChoiceDiv, rakip);

        const label = { tas: "Taş", kagit: "Kağıt", makas: "Makas" };

        if (oyuncu === rakip) {
          message.innerText = `Berabere! 😐 (Sen: ${label[oyuncu]}, Rakip: ${label[rakip]})
Skor: Sen ${oyuncuSkor} - ${rakipSkor} Rakip
Hedef: ${hedefSkor}`;
          highlightWinner(null);
        } else if (
          (oyuncu === "tas" && rakip === "makas") ||
          (oyuncu === "kagit" && rakip === "tas") ||
          (oyuncu === "makas" && rakip === "kagit")
        ) {
          oyuncuSkor++;
          message.innerText = `Kazandın! 🎉 (Sen: ${label[oyuncu]}, Rakip: ${label[rakip]})
Skor: Sen ${oyuncuSkor} - ${rakipSkor} Rakip
Hedef: ${hedefSkor}`;
          highlightWinner("user");
        } else {
          rakipSkor++;
          message.innerText = `Kaybettin! 😢 (Sen: ${label[oyuncu]}, Rakip: ${label[rakip]})
Skor: Sen ${oyuncuSkor} - ${rakipSkor} Rakip
Hedef: ${hedefSkor}`;
          highlightWinner("comp");
        }

        // Hamle bitti, butonları tekrar aktif et
        tasBtn.disabled = false;
        kagitBtn.disabled = false;
        makasBtn.disabled = false;

        if (oyuncuSkor >= hedefSkor) {
          message.innerText = `🏆 Tebrikler! Oyunu sen kazandın! 🎉
Final Skor: Sen ${oyuncuSkor} - ${rakipSkor} Rakip`;
          konfetiAt();
          oyunBitti();
        } else if (rakipSkor >= hedefSkor) {
          message.innerText = `Rakip kazandı! 😢
Final Skor: Sen ${oyuncuSkor} - ${rakipSkor} Rakip`;
          oyunBitti();
        }
      }
    }, 1000);
  }

  // Oyun bitince tekrar butonu
  function oyunBitti() {
    const eski = document.getElementById("restart-wrapper");
    if (eski) eski.remove();

    const restartWrapper = document.createElement("div");
    restartWrapper.id = "restart-wrapper";
    restartWrapper.style.width = "100%";
    restartWrapper.style.display = "flex";
    restartWrapper.style.justifyContent = "center";
    restartWrapper.style.marginTop = "20px";

    const tekrarBtn = document.createElement("button");
    tekrarBtn.innerText = "Tekrar Oyna 🔄";
    tekrarBtn.id = "restart";

    restartWrapper.appendChild(tekrarBtn);
    buttonsDiv.parentNode.insertBefore(restartWrapper, buttonsDiv.nextSibling);

    tekrarBtn.addEventListener("click", () => {
      oyuncuSkor = 0;
      rakipSkor = 0;
      clearHighlights();
      userChoiceDiv.innerHTML = "";
      computerChoiceDiv.innerHTML = "";
      message.innerText = "Oyuna başlamak için butona tıklayın! 😜";
      buttonsDiv.style.display = "none";
      startBtn.style.display = "block";
      restartWrapper.remove();
    });
  }

  // Buton tıklamaları
  tasBtn.addEventListener("click", () => oyun("tas"));
  kagitBtn.addEventListener("click", () => oyun("kagit"));
  makasBtn.addEventListener("click", () => oyun("makas"));
});
