<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <slot />
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30, 60, 114, 0.45);
  backdrop-filter: blur(6px) brightness(0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: background 0.3s;
}
.modal-content {
  background: rgba(255,255,255,0.18);
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 400px;
  max-width: 98vw;
  width: 100%;
  max-width: 500px; /* Ajusta este valor para hacerlo más grande */
  position: relative;
  border: 1px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #1e3c72;
  font-family: 'Poppins', sans-serif;
  animation: modalIn 0.3s;
}
@media (max-width: 600px) {
  .modal-content {
    min-width: 90vw;
    max-width: 98vw;
    padding: 1rem;
  }
}
@keyframes modalIn {
  from { transform: translateY(-30px) scale(0.97); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}
.close-btn {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: transparent;
  color: #1e3c72;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
}
.close-btn:hover {
  color: #42b983;
  background: rgba(255,255,255,0.3);
}
</style>