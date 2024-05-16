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
    const explainRigthOption = document.getElementById("explainRigthOption")
    const expectative = document.getElementById("expectative")
    const inflationDiv = document.getElementById("inflationDiv")

    const spanInflation = document.getElementById("spanInflation")
    const spanInstalments = document.getElementById("spanInstalments")
    const spanCash = document.getElementById("spanCash")

    const modal = document.getElementById("myModal");
    // Obtener el botón que abre la ventana modal
    const btn = document.getElementById("btnSubmit");
    // Obtener el párrafo dentro de la ventana modal para mostrar los datos del formulario
    const modalText = document.getElementById("modalText");
    // Obtener los botones de cancelar y confirmar dentro de la ventana modal
    const cancelButton = document.getElementById("cancelButton");
    const confirmButton = document.getElementById("confirmButton");

    const openModal = () => {
    modal.style.display = "block";
    // Mostrar los datos ingresados en el formulario dentro de la ventana modal
    modalText.textContent = `Efectivo: ${cash.value}\nPrecio en cuotas: ${priceInInstalments.value}\nCuotas: ${dues.value} \nTipo de inflación: ${how.value}`;
    }

    const calcularValorActual = (valorFuturo, tasa, meses) => {
        return valorFuturo / Math.pow(1 + tasa/100, meses);
    }

    const validateInputs = (input, span) => {
        if (!input.value || parseFloat(input.value) <= 0) {
            span.textContent = `${input.name} no puede ser vacío, o igual o menor a 0`;
            span.classList.add('invalid');
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            input.focus();
            return false;
        } else {
            span.classList.remove('invalid');
            span.textContent = ''; // Limpiar mensaje de error si es válido
            return true;
        }
    };


    const inputsMensuales = (howValue, duesValue) => {
        let monthlyInflationInputs = document.getElementById("monthlyInflationInputs");
        monthlyInflationInputs.innerHTML = "";
        
        if (howValue === "month" && duesValue > 0) {
            for (let i = 1; i <= duesValue; i++) {
                let input = document.createElement("input");
                input.type = "number";
                input.name = "inflation-for-month-" + i;
                input.placeholder = "Inflación para la cuota " + i;
                input.value = 8.8;
                input.step = 0.01; 
                input.classList.add("inflation-input");
                monthlyInflationInputs.appendChild(input);
            }
        }
    }

    how.addEventListener("change", () => {

        let duesValue = dues.value;
        let howValue = how.value;
        

        inputsMensuales(howValue, duesValue)
    })

    form.addEventListener("change", () => {
        if (how.value === 'month') { 
            trend.style.display = "none";
            inflationDiv.classList.add("d-none");
        } else {
            trend.style.display = "block";
            inflationDiv.classList.remove("d-none");
        }
        
    });

    form.addEventListener("submit", () => {
        event.preventDefault();

        let validateCash = validateInputs(cash, spanCash)
        let validateInstalments = validateInputs(priceInInstalments, spanInstalments)
        let validateInflation = validateInputs(inflation, spanInflation)
        
        if (!validateCash || !validateInstalments || !validateInflation) {
            return false;
        } else {
            openModal();
        }

    })

    cancelButton.addEventListener("click", () => {
        modal.style.display = "none";
      });
      
      confirmButton.addEventListener("click", () => {      
        let expectativeValue = expectative.value;
        let cashValue = parseFloat(cash.value);
        let priceInInstalmentsValue = parseFloat(priceInInstalments.value);
        let inflationValue = parseFloat(inflation.value);
        let duesValue = parseInt(dues.value);
        let howValue = how.value;
        form.style.display = 'none'

        let valorCuota = priceInInstalmentsValue / duesValue
        let totalValueInstalments = 0;

        if (howValue === "actual") {
            for (let i = 1; i <= duesValue; i++) {
                let tasaInflacionMensual = inflationValue;
    
                if (expectativeValue == "up") {
                    tasaInflacionMensual += 0.003 * (i - 1); 
                } else if (expectativeValue == "down") {
                    tasaInflacionMensual -= 0.003 * (i - 1); 
                }
    
                let precioActualCuota = calcularValorActual(valorCuota, tasaInflacionMensual, i);
                console.log(precioActualCuota)
                totalValueInstalments += precioActualCuota;
            }
        } else if (howValue === "month") {
            const inflationInputs = document.querySelectorAll(".inflation-input");
            inflationInputs.forEach((input, i) => {
                let tasaInflacionMensual = parseFloat(input.value);
                let precioActualCuota = calcularValorActual(valorCuota, tasaInflacionMensual, i + 1); //(i + 1) porque el mes 1 sería el input 0 
                totalValueInstalments += precioActualCuota;
            });
        }

        sectionResult.style.display = 'block'
        cashResult.textContent = "Precio al contado: $" + cashValue.toFixed(2);
        instalmentsResult.textContent = "Precio en cuotas actualizado: $" + totalValueInstalments.toFixed(2);
        if (totalValueInstalments < cashValue) {
            rigthOption.textContent = "Te conviene pagar en cuotas!";
            explainRigthOption.textContent = `Pagando en cuotas ahorras $${(cashValue - totalValueInstalments).toFixed(2)} en plata de hoy... Osea, el ${(((cashValue / totalValueInstalments)-1)*100).toFixed(2)}%! `;
        } else {
            rigthOption.textContent = "Te conviene pagar al contado!";
            explainRigthOption.textContent = `En cuotas pagarías $${(totalValueInstalments - cashValue).toFixed(2)} de más en plata de hoy... Osea, ${(((totalValueInstalments / cashValue)-1)*100).toFixed(2)}% más!`;
        }

        const resultData = {
            cashValue: cashValue.toFixed(2),
            totalValueInstalments: totalValueInstalments.toFixed(2),
            rightOption: rigthOption.textContent,
            explainRightOption: explainRigthOption.textContent
        };
        let results = JSON.parse(localStorage.getItem('comparisonResults')) || [];
        results.push(resultData);
        localStorage.setItem('comparisonResults', JSON.stringify(results));
      
        document.getElementById("modal-content").innerHTML = "<p>Información guardada con éxito ✔️</p>";

        setTimeout(() => {
          modal.style.display = "none";
        }, 1500);
      });
});
