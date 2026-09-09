if (new URLSearchParams(location.search).get('lab') === 'calculus') {
  if (new URLSearchParams(location.search).get('lesson') === 'machine') await import('./calculus/app.js');
  else await import('./calculus/sets-app.js');
} else {
  await import('./main.js');
  const link = document.createElement('a');
  link.href = '?lab=calculus';
  link.textContent = 'Calculus Lab ↗';
  document.querySelector('header nav').prepend(link);
}
