document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formChoice");
    const dues = document.getElementById("dues");
    const how = document.getElementById("how");
    const trend = document.getElementById("trend");

    

    form.addEventListener("change", () => {

        if (how.value === 'month') { 
            trend.style.display = "none";
        }

        let duesValue = dues.value;
        let howValue = how.value;
        let monthlyInflationInputs = document.getElementById("monthlyInflationInputs");
        monthlyInflationInputs.innerHTML = "";
        
        if (howValue === "month" && duesValue > 0) {
            for (let i = 1; i <= duesValue; i++) {
                let input = document.createElement("input");
                input.type = "number";
                input.name = "inflation-for-month-" + i;
                input.placeholder = "Inflación para la cuota " + i;
                monthlyInflationInputs.appendChild(input);
            }
        }
    });
});
