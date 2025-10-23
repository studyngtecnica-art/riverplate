// =======================================================
// 1. FUNCIONALIDAD DEL CARRUSEL PRINCIPAL (INDEX.HTML)
// =======================================================

const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevButton = document.querySelector('.prev-btn');
const nextButton = document.querySelector('.next-btn');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    if (slides[index]) {
        slides[index].classList.add('active');
        currentSlide = index;
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Inicialización y control del carrusel principal
if (totalSlides > 0) {
    let slideInterval = setInterval(nextSlide, 5000); // Automático cada 5 segundos

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
            // Reinicia el contador automático
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });

        nextButton.addEventListener('click', () => {
            nextSlide();
            // Reinicia el contador automático
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    showSlide(currentSlide);
}


// =======================================================
// 2. FUNCIONES GLOBALES DEL CARRITO DE COMPRAS
//    (Necesarias para los onclick en carrito.html)
// =======================================================

/**
 * Muestra el contenido del carrito en la página (usado en carrito.html).
 */
window.mostrarCarritoEnPagina = () => {
    const carrito = JSON.parse(localStorage.getItem('carritoCC')) || [];
    const contenedorCarrito = document.getElementById('contenedor-listado-carrito'); 
    const botonesAcciones = document.getElementById('botones-acciones');

    if (!contenedorCarrito) return; 

    contenedorCarrito.innerHTML = ''; 
    let totalPagar = 0;

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p>Tu carrito está vacío. <a href="tienda.html" style="color: var(--color-rojo-banda); font-weight: bold;">¡Visita la tienda y añade productos!</a></p>';
        
        let totalElemento = document.getElementById('total-final');
        if (!totalElemento) {
            totalElemento = document.createElement('div');
            totalElemento.id = 'total-final';
            contenedorCarrito.appendChild(totalElemento);
        }
        totalElemento.textContent = 'Total a Pagar: $0.00';
        
        if (botonesAcciones) botonesAcciones.style.display = 'none';
        return;
    }
    
    if (botonesAcciones) botonesAcciones.style.display = 'flex';

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalPagar += subtotal;
        
        const elemento = document.createElement('div');
        elemento.classList.add('item-carrito');
        elemento.innerHTML = `
            <div>
                <h4>${item.nombre}</h4>
                <p>Precio Unitario: $${item.precio.toFixed(2)}</p>
            </div>
            <div style="text-align: right;">
                <p>Cantidad: <strong>${item.cantidad}</strong></p>
                <p>Subtotal: <strong>$${subtotal.toFixed(2)}</strong></p>
                <button onclick="eliminarItemCarrito('${item.id}')">Eliminar</button>
            </div>
        `;
        contenedorCarrito.appendChild(elemento);
    });

    let totalElemento = document.getElementById('total-final');
    if (!totalElemento) {
        totalElemento = document.createElement('div');
        totalElemento.id = 'total-final';
        contenedorCarrito.appendChild(totalElemento);
    }
    totalElemento.textContent = `Total a Pagar: $${totalPagar.toFixed(2)}`;
};

/**
 * Elimina un producto por su ID del carrito y recarga la vista.
 */
window.eliminarItemCarrito = (id) => {
    let carrito = JSON.parse(localStorage.getItem('carritoCC')) || [];
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem('carritoCC', JSON.stringify(carrito));
    mostrarCarritoEnPagina();
};

/**
 * Vacía completamente el carrito.
 */
window.vaciarCarrito = () => {
    if (!document.getElementById('contenedor-listado-carrito')) return; 

    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        localStorage.removeItem('carritoCC');
        mostrarCarritoEnPagina(); 
    }
};


// =======================================================
// 3. EVENTOS AL CARGAR EL CONTENIDO (TIENDA.HTML y General)
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 3.1. LÓGICA DEL NUEVO BANNER CARRUSEL (TIENDA.HTML)
    // =======================================================
    const bannerTrack = document.querySelector('.banner-track');
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const bannerDotsContainer = document.querySelector('.banner-dots');
    const totalBannerSlides = bannerSlides.length;

    if (bannerTrack && totalBannerSlides > 0) {
        let currentBannerIndex = 0;
        const BANNER_INTERVAL_TIME = 4000; // 4 segundos

        // 3.1.1. Crea los puntos (dots) de navegación
        for (let i = 0; i < totalBannerSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('banner-dot');
            dot.dataset.index = i;
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToBannerSlide(i);
                clearInterval(bannerInterval);
                bannerInterval = setInterval(nextBannerSlide, BANNER_INTERVAL_TIME);
            });
            bannerDotsContainer.appendChild(dot);
        }

        // 3.1.2. Función de transición
        const goToBannerSlide = (index) => {
            bannerTrack.style.transform = `translateX(-${index * 100}%)`;
            currentBannerIndex = index;
            updateBannerDots();
        };

        // 3.1.3. Función para ir al siguiente slide
        const nextBannerSlide = () => {
            currentBannerIndex = (currentBannerIndex + 1) % totalBannerSlides;
            goToBannerSlide(currentBannerIndex);
        };

        // 3.1.4. Actualiza la clase 'active' en los puntos
        const updateBannerDots = () => {
            document.querySelectorAll('.banner-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentBannerIndex);
            });
        };

        // Inicia el carrusel automático
        let bannerInterval = setInterval(nextBannerSlide, BANNER_INTERVAL_TIME);
    }
    
    
    // =======================================================
    // 3.2. LÓGICA DEL CARRUSEL DE PRODUCTOS (TIENDA.HTML)
    // =======================================================
    const carruselesTienda = document.querySelectorAll('.productos-carrusel');
    const TIEMPO_DESPLAZAMIENTO = 4000; 

    carruselesTienda.forEach(carrusel => {
        const productos = carrusel.querySelectorAll('.producto-card');
        if (productos.length === 0) return;

        let currentIndex = 0;
        
        const desplazarProducto = () => {
            // Se asume un margen (gap) de 20px (definido en styles.css)
            const anchoProducto = productos[0].offsetWidth + 20; 
            
            if (currentIndex >= productos.length) {
                currentIndex = 0;
                carrusel.scrollTo({ left: 0, behavior: 'auto' }); 
                return; 
            }

            const scrollPos = currentIndex * anchoProducto;
            
            carrusel.scrollTo({
                left: scrollPos,
                behavior: 'smooth' 
            });

            currentIndex++;
        };

        // Inicia el desplazamiento automático solo en la tienda
        if (carrusel.closest('.tienda-container')) {
             setInterval(desplazarProducto, TIEMPO_DESPLAZAMIENTO);
        }
    });


    // =======================================================
    // 3.3. LÓGICA DEL CARRITO DE COMPRAS (AÑADIR PRODUCTOS)
    // =======================================================
    const botonesCarrito = document.querySelectorAll('.btn-carrito');
    
    botonesCarrito.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const card = e.target.closest('.producto-card');
            
            const productoId = card.dataset.id;
            const productoNombre = card.querySelector('h3').textContent;
            
            // Captura el precio final (prioriza precio-oferta)
            let precioElemento = card.querySelector('.precio-oferta') || card.querySelector('.precio');
            let precioTexto = precioElemento.textContent.trim();
            
            // Limpieza del precio: quita $, puntos y convierte a float
            const productoPrecio = parseFloat(precioTexto.replace('$', '').replace(/\./g, '').replace(',', '.').trim());

            const nuevoProducto = {
                id: productoId,
                nombre: productoNombre,
                precio: productoPrecio,
                cantidad: 1
            };

            let carrito = JSON.parse(localStorage.getItem('carritoCC')) || [];
            
            const itemExistente = carrito.find(item => item.id === productoId);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carrito.push(nuevoProducto);
            }

            localStorage.setItem('carritoCC', JSON.stringify(carrito));
            
            alert(`¡${productoNombre} añadido al carrito!`);
        });
    });
});