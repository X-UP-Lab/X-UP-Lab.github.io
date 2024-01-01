window.onload = function() {
    var items = document.querySelectorAll('.item');
  
    items.forEach(function(item, index) {
      var realButton = item.querySelector('.real-button');
      var fakeButton = item.querySelector('.fake-button');
      var answer = item.querySelector('.answer');
  
      // Define if each image is real or fake
      var isReal = Math.random() < 0.5; // Random for example, replace with your own logic
  
      realButton.addEventListener('click', function() {
        answer.textContent = isReal ? 'Correct, it is real!' : 'Wrong, it is fake!';
      });
  
      fakeButton.addEventListener('click', function() {
        answer.textContent = isReal ? 'Wrong, it is real!' : 'Correct, it is fake!';
      });
    });
  };
  