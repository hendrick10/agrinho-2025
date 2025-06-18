let score = 0;
let fruits = [];
let seedImage;
let seedlingImage;
let vineImage;
let flowerImage;
let passionFruitImage;

// Preload images for better performance
function preload() {
}

function setup() {
  createCanvas(700, 450);
  textAlign(CENTER, CENTER);
  textSize(28);

  // Se você não tiver imagens, vamos criar representações gráficas simples
  seedImage = createGraphics(30, 30);
  seedImage.noStroke();
  seedImage.fill(100, 50, 0); // Marrom escuro para semente
  seedImage.ellipse(15, 15, 20, 20);

  seedlingImage = createGraphics(40, 40);
  seedlingImage.noStroke();
  seedlingImage.fill(0, 128, 0); // Verde para folhinhas da muda
  seedlingImage.rect(15, 25, 10, 15);
  seedlingImage.triangle(20, 0, 0, 40, 40, 40); // Uma folha simples

  vineImage = createGraphics(60, 60);
  vineImage.noStroke();
  vineImage.fill(34, 139, 34); // Verde floresta para o cipó
  vineImage.rect(25, 10, 10, 50);
  vineImage.ellipse(30, 0, 20, 20); // Um pouco de espiral no topo
  vineImage.fill(124, 252, 0); // Verde claro para alguns detalhes
  vineImage.ellipse(15, 30, 10, 10);
  vineImage.ellipse(45, 45, 10, 10);

  flowerImage = createGraphics(50, 50);
  flowerImage.noStroke();
  flowerImage.fill(255, 215, 0); // Amarelo dourado para a flor
  flowerImage.ellipse(25, 25, 45, 45);
  flowerImage.fill(255, 255, 255); // Branco para o centro da flor
  flowerImage.ellipse(25, 25, 15, 15);
  flowerImage.fill(138, 43, 226); // Violeta para os detalhes internos
  flowerImage.ellipse(25, 25, 5, 5);

  passionFruitImage = createGraphics(70, 70);
  passionFruitImage.noStroke();
  passionFruitImage.fill(255, 165, 0); // Laranja para o maracujá
  passionFruitImage.ellipse(35, 35, 60, 60);
  passionFruitImage.fill(0, 128, 0); // Verde para o cabinho
  passionFruitImage.rect(30, 0, 10, 15);
}

function draw() {
  background(173, 216, 230); // Azul claro para o céu
  drawGround();

  for (let i = fruits.length - 1; i >= 0; i--) {
    let f = fruits[i];
    f.display();
    f.update();

    // Maracujá colhido desaparece rapidinho
    if (f.stage === 4 && millis() - f.stageTime > 700) { // Desaparece depois de 0.7 segundos
      fruits.splice(i, 1);
    }
  }

  fill(0);
  text(`Pontuação: ${score}`, width / 2, 40);
  text("Clique para plantar, regar e colher!", width / 2, height - 30);
}

function drawGround() {
  fill(139, 69, 19); // Marrom terra
  rect(0, height * 0.7, width, height * 0.3);
}

function mousePressed() {
  if (mouseY > height * 0.7) { // Só interage na área da terra
    let clickedOnExisting = false;
    for (let i = fruits.length - 1; i >= 0; i--) {
      let f = fruits[i];
      let d = dist(mouseX, mouseY, f.x, f.y);
      if (d < 40) { // Clicou em algo existente
        f.nextStage();
        clickedOnExisting = true;
        break;
      }
    }

    if (!clickedOnExisting) {
      fruits.push(new PassionFruit(mouseX, mouseY));
    }
  }
}

class PassionFruit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.stage = 0; // 0: semente, 1: mudinha, 2: cipó, 3: flor, 4: maracujá (colhido)
    this.stageTime = millis(); // Tempo em que o estágio atual começou
  }

  display() {
    push();
    translate(this.x, this.y);
    imageMode(CENTER);

    if (this.stage === 0) {
      image(seedImage, 0, 0);
    } else if (this.stage === 1) {
      image(seedlingImage, 0, 0);
    } else if (this.stage === 2) {
      image(vineImage, 0, 0);
    } else if (this.stage === 3) {
      image(flowerImage, 0, 0);
    } else if (this.stage === 4) {
      image(passionFruitImage, 0, 0);
    }
    pop();
  }

  update() {
    // Crescimento automático se não for clicado
    if (this.stage === 0 && millis() - this.stageTime > 600) { // Semente -> Mudinha em 0.6s
      this.stage = 1;
      this.stageTime = millis();
    } else if (this.stage === 1 && millis() - this.stageTime > 800) { // Mudinha -> Cipó em 0.8s
      this.stage = 2;
      this.stageTime = millis();
    } else if (this.stage === 2 && millis() - this.stageTime > 1000) { // Cipó -> Flor em 1s
        this.stage = 3;
        this.stageTime = millis();
    } else if (this.stage === 3 && millis() - this.stageTime > 1200) { // Flor -> Maracujá em 1.2s
        this.stage = 4;
        this.stageTime = millis();
    }
  }

  nextStage() {
    this.stage++;
    this.stageTime = millis(); // Reinicia o timer para o novo estágio

    if (this.stage === 4) { // Maracujá colhido
      score++;
      // O maracujá será removido no loop 'draw' após um tempo
    }
  }
}