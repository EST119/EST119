// Toast function
    function showToast(msg, duration=2200) {
      const t = document.getElementById("toast");
      t.textContent = msg;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), duration);
    }
    function copyWhatsApp() {
      navigator.clipboard.writeText("+524435637315").then(() => {
        showToast("¡Número copiado! Pega en WhatsApp", 2000);
      });
    }
    // Cookies
    function setCookie(n,v,d){const e=new Date();e.setTime(e.getTime()+d*864e5);document.cookie=n+"="+v+";expires="+e.toUTCString()+";path=/";}
    function getCookie(n){const c=n+"=",a=decodeURIComponent(document.cookie).split(';');for(let i=0;i<a.length;i++){let x=a[i].trim();if(x.indexOf(c)===0)return x.substring(c.length)}return "";}
    let currentLink = "";
    function openModal(el) {
      if (getCookie("est119_warning")==="hidden") { window.open(el.href,"_blank"); return; }
      currentLink = el.href;
      document.getElementById("warningModal").style.display="flex";
      const s=document.getElementById("skipBtn"), c=document.getElementById("continueBtn");
      s.disabled=c.disabled=true; s.classList.remove("active"); c.classList.remove("active");
      let sec=5;
      s.textContent=c.textContent=`Esperando ${sec}s...`;
      const t=setInterval(()=>{
        sec--;
        s.textContent=`No mostrar más (${sec}s)`;
        c.textContent=`Estoy de acuerdo (${sec}s)`;
        if(sec<=0){
          clearInterval(t);
          s.textContent="No mostrar más"; c.textContent="Estoy de acuerdo";
          s.classList.add("active"); c.classList.add("active");
          s.disabled=c.disabled=false;
          s.onclick=()=>{setCookie("est119_warning","hidden",30);closeModal();window.open(currentLink,"_blank");};
          c.onclick=()=>{setCookie("est119_warning","hidden",30);closeModal();window.open(currentLink,"_blank");};
        }
      },1000);
    }
    function closeModal(){ document.getElementById("warningModal").style.display="none"; }
    window.addEventListener("load",()=>{
      if(getCookie("est119_warning")!=="hidden"){
        document.getElementById("warningModal").style.display="flex";
        let sec=5;
        const s=document.getElementById("skipBtn"), c=document.getElementById("continueBtn");
        s.textContent=c.textContent=`Esperando ${sec}s...`;
        const t=setInterval(()=>{
          sec--;
          s.textContent=`No mostrar más (${sec}s)`;
          c.textContent=`Estoy de acuerdo (${sec}s)`;
          if(sec<=0){
            clearInterval(t);
            s.textContent="No mostrar más"; c.textContent="Estoy de acuerdo";
            s.classList.add("active"); c.classList.add("active");
            s.disabled=c.disabled=false;
            s.onclick=()=>{setCookie("est119_warning","hidden",30);closeModal();};
            c.onclick=()=>{setCookie("est119_warning","hidden",30);closeModal();};
          }
        },1000);
      }
      updateSidebarCounts();
      formatMetaChips();
    });
    // Categorías
    function showCategory(id){
      document.querySelectorAll('.game-zones').forEach(z=>z.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      document.querySelectorAll('.sidebar a').forEach(a=>a.classList.remove('active'));
      const sidebarLink = document.querySelector(`.sidebar a[onclick="showCategory('${id}')"]`);
      if(sidebarLink) sidebarLink.classList.add('active');
    }
    // Búsqueda GLOBAL
    function searchGlobal(){
      const q = document.getElementById("searchBox").value.toLowerCase().trim();
      document.querySelectorAll(".game-item").forEach(item => {
        const name = item.dataset.name?.toLowerCase() || "";
        item.style.display = name.includes(q) ? "block" : "none";
      });
    }
    // Video modal (tutorial de instalación)
    function openVideoModal(){
      document.getElementById("videoModal").style.display="flex";
    }
    function closeVideoModal(){ document.getElementById("videoModal").style.display="none"; }
    // Contador de tarjetas por categoría en el sidebar
    function updateSidebarCounts(){
      document.querySelectorAll('.sidebar a[data-cat]').forEach(a=>{
        const zone = document.getElementById(a.dataset.cat);
        const badge = a.querySelector('.count-badge');
        if(!zone || !badge) return;
        const count = zone.querySelectorAll('.game-item').length;
        if(count > 0){ badge.textContent = count; badge.style.display = 'inline-block'; }
        else { badge.style.display = 'none'; }
      });
    }
    // Convierte "3.86 GB • Acción / Aventura • 2004" en chips visuales
    function formatMetaChips(){
      document.querySelectorAll('.game-item > span').forEach(span=>{
        const parts = span.textContent.split('•').map(p=>p.trim()).filter(Boolean);
        if(parts.length > 1){
          span.innerHTML = parts.map(p=>`<span class="chip">${p}</span>`).join('');
          span.classList.add('chips-row');
        }
      });
    }
    // ==================== CONTADORES DE TICKETS (localStorage - por navegador) ====================
    let totalTickets = parseInt(localStorage.getItem('est119_totalTickets') || '0');
    let dailyTickets = parseInt(localStorage.getItem('est119_dailyTickets') || '0');
    const currentDate = new Date().toLocaleDateString('es-MX');
    const lastSendDate = localStorage.getItem('est119_lastSendDate');
    if (lastSendDate !== currentDate) {
      dailyTickets = 0;
      localStorage.setItem('est119_dailyTickets', '0');
      localStorage.setItem('est119_lastSendDate', currentDate);
    }
    // ENVÍO DE TICKET A DISCORD WEBHOOK
    function sendTicket() {
      const message = document.getElementById('ticketMessage').value.trim();
      if (message === '') {
        showToast('⚠️ Por favor escribe tu petición antes de enviar.', 3000);
        return;
      }
      const nextDaily = dailyTickets + 1;
      const nextTotal = totalTickets + 1;
      const now = new Date();
      const date = now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const time = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const webhookURL = 'https://discord.com/api/webhooks/1464052230306140284/KrL_FcKD90P2cbeeXjVy0s45_27r59Nbj4F_poSEdIKtEhUb-c-3VJmPs6ejJbOa5lVd';
      const payload = {
        embeds: [{
          title: '🎫 Nuevo Ticket EST 119',
          description: message,
          color: 50175,
          fields: [
            { name: '📅 Fecha', value: date, inline: true },
            { name: '🕐 Hora', value: time, inline: true },
            { name: '🔢 Ticket del día', value: `${nextDaily}`, inline: true },
            { name: '🔢 Ticket total (aprox.)', value: `${nextTotal}`, inline: true }
          ],
          timestamp: now.toISOString(),
          footer: { text: 'Sistema de Tickets | Enviado desde la web' }
        }]
      };
      const btn = event.target;
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (response.ok) {
          showToast('✅ ¡Ticket enviado correctamente!', 3500);
          document.getElementById('ticketMessage').value = '';
          dailyTickets = nextDaily;
          totalTickets = nextTotal;
          localStorage.setItem('est119_dailyTickets', dailyTickets);
          localStorage.setItem('est119_totalTickets', totalTickets);
          localStorage.setItem('est119_lastSendDate', currentDate);
        } else {
          showToast('❌ Error al enviar el ticket (respuesta del servidor).', 4000);
        }
      })
      .catch(() => {
        showToast('🌐 Error de conexión. Revisa tu internet e inténtalo de nuevo.', 4000);
      })
      .finally(() => {
        btn.disabled = false;
        btn.textContent = 'Enviar Ticket';
      });
    }
    // GALERÍA DE IMÁGENES
    const galleryData = {
      "gta san andreas": [
        "https://techsyndrome.in/wp-content/uploads/2021/11/Gta-San-Andreas-Definitive-Edition-Screenshot-2021.11.12-00.15.08.78.png",
        "https://images.hdqwalls.com/download/gta-san-andreas-qhd-1280x720.jpg",
        "https://www.cubed3.com/wp-content/uploads/2025/09/grand-theft-auto-san-andreas-pc-screenshot-art-1.jpg",
        "https://www.oldgamehermit.com/wp-content/uploads/2022/01/gta-sa-2021-12-31-17-12-28-09.png",
        "https://raketcontent.com/1/5a421_16861597416373_1920_07f1527df7.png"
      ],
      "gta vice city": [
        "https://images.launchbox-app.com//28c8f0d7-bc0f-4597-92ef-fa20e688a872.jpg",
        "https://media.moddb.com/images/mods/1/43/42013/Grand_Theft_Auto_Vice_City_Screenshot_2019.02.25_-_23.32.14.35.png",
        "https://tse3.mm.bing.net/th/id/OIP.J6DDVqvJBh12ZNnBQqT97AHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://assetsio.gnwcdn.com/gta-vice-city-7.jpg?width=1920",
        "https://m.thegtaplace.com/images/vicecity/screenshots/xbox/full_vc_10.jpg"
      ],
      "five nights at freddy's": [
        "https://i.ytimg.com/vi/KQGbPna-tWY/maxresdefault.jpg",
        "https://upload.wikimedia.org/wikipedia/en/thumb/8/84/FNAF_2_office.jpg/330px-FNAF_2_office.jpg?width=1920",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/354140/ss_ffcb2ebf7e91f0285666e13d5015ff93284071e7.1920x1080.jpg?t=1579635991",
        "https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/6f0e0bae-96d1-11e6-a8d5-00163ec9f5fa/679852783/five-nights-at-freddys-4-screenshot.jpg",
        "https://th.bing.com/th/id/R.24358a1449d7c13288953f9d953801bd?rik=u5Eylf0gT47xRg&pid=ImgRaw&r=0g"
      ],
      "60 seconds": [
        "https://robotgentleman.com/60seconds/assets/img/media/60s_Screen_01.jpg",
        "https://images.gamewatcherstatic.com/screenshot/image/8/ee/281948/ss_9b65e7962224bca274b9dec1532154c737f7d476.1920x1080.jpg",
        "https://robotgentleman.com/60seconds/assets/img/media/60s_Screen_09.jpg",
        "https://gamerheadquarters.com/articles/images/screenshots/indie/60seconds1.jpg",
        "https://www.video-games-museum.com/en/screenshots/Switch/3/74620-ingame-60-Seconds-Reatomized.jpg"
      ],
      "warcraft iii reign of chaos": [
        "https://i.ytimg.com/vi/_Uo9o9EI59E/maxresdefault.jpg",
        "https://i.ytimg.com/vi/ZPqS1WJYpeM/maxresdefault.jpg",
        "https://i.ytimg.com/vi/4D3IS5TAofs/maxresdefault.jpg",
        "https://hips.hearstapps.com/digitalspyuk.cdnds.net/14/32/gaming-warcraft-3-reign-of-chaos-screenshot-1.jpg",
        "https://i.ytimg.com/vi/9YMPGV9e7Bc/maxresdefault.jpg"
      ]
    };
    function openGallery(e) {
      if (e.target.closest('.download-btn')) return;
      if (e.target.closest('.pelicula-item')) return;
      const item = e.currentTarget;
      const name = item.dataset.name;
      const images = galleryData[name] || [];
      if (images.length === 0) return;
      const title = item.querySelector('strong').textContent;
      document.getElementById('galleryTitle').textContent = title;
      const container = document.getElementById('galleryImages');
      container.innerHTML = '';
      images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Captura del juego';
        container.appendChild(img);
      });
      document.getElementById('galleryModal').style.display = 'flex';
    }
    function closeGallery() {
      document.getElementById('galleryModal').style.display = 'none';
    }
    document.querySelectorAll('.game-item').forEach(item => {
      item.addEventListener('click', openGallery);
    });
    document.addEventListener("keydown", e => {
      if(e.key === "Escape") { closeModal(); closeVideoModal(); closeGallery(); }
    });
