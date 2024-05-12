document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formChoice");
    const dues = document.getElementById("dues");
    const how = document.getElementById("how");
    const trend = document.getElementById("trend");
    const cash = document.getElementById("cash");
    const priceInInstalments = document.getElementById("price-in-instalments");
    const inflation = document.getElementById("inflationRate")
    const sectionResult = document.getElementById("result")
    const cashResult = document.getElementById("cashResult")
    const instalmentsResult = document.getElementById("instalmentsResult")
    const rigthOption = document.getElementById("rightOption")

    const calcularValorActual = (valorFuturo, tasa, meses) => {
        return valorFuturo / Math.pow(1 + tasa/100, meses);
    }

    const inputsMensuales = (howValue, duesValue) => {
        let monthlyInflationInputs = document.getElementById("monthlyInflationInputs");
        monthlyInflationInputs.innerHTML = "";
        
        if (howValue === "month" && duesValue > 0) {
            for (let i = 1; i <= duesValue; i++) {
                let input = document.createElement("input");
                input.type = "number";
                input.name = "inflation-for-month-" + i;
                input.placeholder = "Inflación para la cuota " + i;
                input.classList.add("inflation-input");
                monthlyInflationInputs.appendChild(input);
            }
        }

        const inputsInflation = document.querySelectorAll(".inflation-input");
    }

    form.addEventListener("change", () => {

        if (how.value === 'month') { 
            trend.style.display = "none";
        } else {
            trend.style.display = "block";
        }

        let duesValue = dues.value;
        let howValue = how.value;
        

        inputsMensuales(howValue, duesValue)
        
    });

    form.addEventListener("submit", () => {
        let trendValue = trend.value;
        let cashValue = cash.value;
        let priceInInstalmentsValue = priceInInstalments.value;
        let inflationValue = inflation.value;
        let duesValue = dues.value;
        let howValue = how.value;

        event.preventDefault();
        let valorCuota = priceInInstalmentsValue / duesValue
        let totalValueInstalments = 0;

        if (howValue === "actual") {
            for (let i = 1; i <= duesValue; i++) {
                let precioActualCuota = calcularValorActual(valorCuota, inflationValue, i)
                totalValueInstalments += precioActualCuota
            }

        }

        sectionResult.style.display = 'block'
        instalmentsResult.textContent = `Precio en cuotas actualizado: ${totalValueInstalments}`

        form.style.dysplay = 'none'
        
    })
});
