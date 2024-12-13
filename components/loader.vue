<template>
  <div class="overlay">
    <div class="loading">
      <div class="side front">
        <div class="credential">
          <img
            src="https://img.freepik.com/premium-vector/businessman-character-avatar-icon-vector-illustration-design_24877-18271.jpg"
            alt="Avatar"
            class="avatar"
          />
          <div class="details">
            <p class="name">Ulises García</p>
            <p class="id">Matrícula: 20203tn022</p>
            <p class="institution">Institución: UliGarci</p>
          </div>
        </div>
      </div>

      <div class="side back">
        <div class="qr-container">
          <p class="qr-text">Escanea para más información:</p>
          <img
            src="https://static.vecteezy.com/system/resources/previews/021/115/776/non_2x/qr-code-free-png.png"
            alt="QR Code"
            class="qr"
          />
        </div>
      </div>
    </div>
    <div class="loading-container">
      <div class="loaders"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RotatingCredentialLoader",
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(248, 245, 245, 0.967);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading {
  width: 210px;
  height: 115px;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  border-radius: 16px;
  border: 4px solid #0071e2;
  border-top-width: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  transform-style: preserve-3d;
  animation: rotateLoader 3s linear infinite;
}

.side {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 16px;
  backface-visibility: hidden;
}

.front {
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
}

.credential {
  display: flex;
  align-items: center;
  padding: 10px;
}

.avatar {
  width: 60px;
  height: 60px;
  border: 3px solid #0071e2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-right: 15px;
}

.details {
  font-family: "Arial", sans-serif;
  color: #333;
}

.name {
  font-size: 16px;
  font-weight: bold;
}

.id {
  font-size: 10px;
  color: #555;
}

.institution {
  font-size: 12px;
  color: #0071e2;
  font-weight: bold;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.qr {
  width: 70px;
  height: 70px;
  margin-top: 5px;
  border: 2px solid #ccc;
  border-radius: 8px;
}

.qr-text {
  font-size: 12px;
  color: #333;
}

.loading-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loaders {
  display: block;
  --height-of-loader: 4px;
  --loader-color: #0071e2;
  width: 130px;
  height: var(--height-of-loader);
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
}

.loaders::before {
  content: "";
  position: absolute;
  background: var(--loader-color);
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  border-radius: 30px;
  animation: moving 1s ease-in-out infinite;
}

@keyframes moving {
  50% {
    width: 100%;
  }
  100% {
    width: 0;
    right: 0;
    left: unset;
  }
}

@keyframes rotateLoader {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
</style>
