import './css/style.css';
import Timeline from './js/Timeline';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const timeline = new Timeline(app);

  timeline.init();
});
