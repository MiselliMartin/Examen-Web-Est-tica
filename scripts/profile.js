document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");
  const results = JSON.parse(localStorage.getItem('comparisonResults')) || [];

  if (results.length > 0) {
      results.forEach(result => {
          const resultDiv = document.createElement("div");
          resultDiv.classList.add("result");

          const cashResult = document.createElement("p");
          cashResult.textContent = "Precio al contado: $" + result.cashValue;

          const instalmentsResult = document.createElement("p");
          instalmentsResult.textContent = "Precio en cuotas actualizado: $" + result.totalValueInstalments;

          const rightOption = document.createElement("h2");
          rightOption.textContent = result.rightOption;

          const explainRightOption = document.createElement("p");
          explainRightOption.textContent = result.explainRightOption;

          resultDiv.appendChild(cashResult);
          resultDiv.appendChild(instalmentsResult);
          resultDiv.appendChild(rightOption);
          resultDiv.appendChild(explainRightOption);

          resultsContainer.appendChild(resultDiv);
      });
  } else {
      const noResults = document.createElement("p");
      noResults.textContent = "No hay resultados guardados.";
      resultsContainer.appendChild(noResults);
  }
});