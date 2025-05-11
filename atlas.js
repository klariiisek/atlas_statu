const countriesList = document.getElementById("countries-list");
const continent = document.getElementById("continent");
const modalBody = document.getElementById("modal-body-content");
const modalTitle = document.getElementById("modal-title");
const modal = new bootstrap.Modal(document.getElementById("one-country"));

function loadCountries(region) {
    countriesList.innerHTML = "";
    fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then(res => res.json())
    .then(data => {
        data.forEach((country) => {
            let blockCountry = `
                <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 p-2">
                    <div class="card h-100">
                        <img class="card-img-top" src="${country.flags.png}" alt="Vlajka ${country.name.common}" style="width: 100%; height: 150px; object-fit: cover;" />
                        <div class="card-body d-flex flex-column justify-content-between">
                            <h4 class="card-title"><a href="#">${country.translations.ces?.common || country.name.common}</a></h4>
                            <p class="card-text">Hlavní město: <b>${country.capital?.[0] || "N/A"}</b></p>
                            <p><button class="btn btn-info mt-auto" data-name="${country.name.common}">Informace</button></p>
                        </div>
                    </div>
                </div>`;
            countriesList.innerHTML += blockCountry;
        });

        document.querySelectorAll('button[data-name]').forEach(button => {
            button.addEventListener('click', () => {
                const countryName = button.getAttribute('data-name');
                modal.show();
                fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
                .then(res => res.json())
                .then(data => {
                    const country = data[0];
                    const officialName = country.translations.ces?.common || country.name.common;
                    const capital = country.capital?.[0] || "N/A";
                    const area = country.area?.toLocaleString("cs-CZ") || "N/A";
                    const population = country.population?.toLocaleString("cs-CZ") || "N/A";
                    const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
                    const borders = country.borders?.join(", ") || "žádné";

                    modalTitle.innerHTML = officialName;
                    modalBody.innerHTML = `
                        <img src="${country.flags.png}" alt="Vlajka ${officialName}" class="img-fluid mb-3">
                        <p><b>Hlavní město:</b> ${capital}</p>
                        <p><b>Rozloha:</b> ${area} km<sup>2</sup></p>
                        <p><b>Populace:</b> ${population} lidí</p>
                        <p><b>Hlavní jazyk:</b> ${languages}</p>
                        <p><b>Sousední státy:</b> ${borders}</p>
                    `;
                })
                .catch(error => {
                    modalBody.innerHTML = "Nepodařilo se načíst informace.";
                    console.log(`Chyba: ${error}`);
                });
            });
        });
    })
    .catch(error => {
        console.log(error);
    });
}

loadCountries("europe");

continent.addEventListener("change", function(event) {
    loadCountries(event.target.value);
});