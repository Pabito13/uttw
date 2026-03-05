// === Formularz Web3Forms ===
const form = document.getElementById('form');
if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        formData.append("access_key", "0f095813-ef03-457d-9331-c643d0fd0609");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Wysyłanie...";
        submitBtn.disabled = true;
        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                alert("✅ Wiadomość wysłana! Odezwiemy się wkrótce.");
                form.reset();
            } else {
                alert("Błąd: " + data.message);
            }
        } catch (error) {
            alert("Coś poszło nie tak. Spróbuj ponownie.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// === Nav toggle ===
function toggleNav() {
    document.getElementById('navLeft').classList.toggle('open');
}
document.addEventListener('click', function (e) {
    const nav = document.getElementById('navLeft');
    if (!nav.contains(e.target)) nav.classList.remove('open');
});

// === Mapa Europy D3 ===
const highlighted = new Set([
    "Poland", "Germany", "France", "Spain", "Switzerland", "Italy", "Austria",
    "Belgium", "Croatia", "Hungary", "Romania", "Slovakia", "Czechia",
    "Serbia", "Bosnia and Herz.", "Greece", "Bulgaria", "United Kingdom"
]);

const W = 560, H = 500;
const svg = d3.select("#europe-map")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

svg.append("rect").attr("width", W).attr("height", H).attr("fill", "#cde4f5");

const projection = d3.geoMercator()
    .center([12, 48])           // środek pomiędzy Niemcami, Czechami i Austrią
    .scale(620)                 // skala dopasowana aby widoczne były GB i Grecja
    .translate([W / 2, H / 2]); // centrowanie



const pathGen = d3.geoPath().projection(projection);

// ISO numeric → name (Europa + sąsiedzi)
const countryNames = {
    "8": "Albania", "20": "Andorra", "40": "Austria", "56": "Belgium",
    "70": "Bosnia and Herz.", "100": "Bulgaria", "191": "Croatia",
    "196": "Cyprus", "203": "Czechia", "208": "Denmark", "233": "Estonia",
    "246": "Finland", "250": "France", "276": "Germany", "300": "Greece",
    "348": "Hungary", "352": "Iceland", "372": "Ireland", "380": "Italy",
    "428": "Latvia", "438": "Liechtenstein", "440": "Lithuania",
    "442": "Luxembourg", "470": "Malta", "498": "Moldova", "492": "Monaco",
    "499": "Montenegro", "528": "Netherlands", "578": "Norway", "616": "Poland",
    "620": "Portugal", "642": "Romania", "674": "San Marino", "688": "Serbia",
    "703": "Slovakia", "705": "Slovenia", "724": "Spain", "752": "Sweden",
    "756": "Switzerland", "807": "North Macedonia", "826": "United Kingdom",
    "804": "Ukraine", "112": "Belarus", "643": "Russia", "792": "Turkey",
    "31": "Azerbaijan", "268": "Georgia", "51": "Armenia", "383": "Kosovo",
    "504": "Morocco", "788": "Tunisia", "12": "Algeria"
};

fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
    .then(r => r.json())
    .then(world => {
        const countries = topojson.feature(world, world.objects.countries);
        svg.selectAll("path.country")
            .data(countries.features)
            .enter().append("path")
            .attr("d", pathGen)
            .attr("fill", d => {
                const name = countryNames[String(+d.id)];
                if (!name) return "#e0e0e0";
                return highlighted.has(name) ? "#1a6eb5" : "#ffffff";
            })
            .attr("stroke", "#999")
            .attr("stroke-width", "0.6");
    });