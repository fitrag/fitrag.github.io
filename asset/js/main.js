var typed = new Typed("#typed", {
    stringsElement: "#typed-strings",
    typeSpeed: 80,
  });

  var typed1 = new Typed("#typed1", {
    stringsElement: "#typed-strings1",
    typeSpeed: 80,
  });

  const header = document.getElementById("header")
        const logo = document.getElementById("logo")
        window.addEventListener('scroll', function(){
            const top = window.scrollY
            if(top > 100){
                header.classList.add('bg-white')
                header.classList.remove('bg-transparent')
                logo.classList.remove('logo')
                logo.classList.add('logoScroll')
                header.classList.add('shadow-sm')
            }else{
                header.classList.remove('bg-white')
                header.classList.add('bg-transparent')
                logo.classList.add('logo')
                logo.classList.remove('logoScroll')
                header.classList.remove('shadow-sm')
            }
        })