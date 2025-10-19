document.addEventListener('DOMContentLoaded', async () => {
  const detalheContainer = document.getElementById('detalhe-container');

  const params = new URLSearchParams(window.location.search);
  const cardMultiverseId = params.get('multiverseid');

  if (!cardMultiverseId) {
    detalheContainer.innerHTML = `
      <p class="text-danger">
        Nenhuma carta selecionada. <a href="index.html">Volte para a busca</a>.
      </p>
    `;
    return;
  }

  try {
    const resposta = await fetch('data.json');
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

    const dados = await resposta.json();
    const todasAsCartas = dados.cards;
    const carta = todasAsCartas.find(c => String(c.multiverseid) === cardMultiverseId);

    if (!carta) {
      detalheContainer.innerHTML = `
        <p class="text-danger">
          Carta não encontrada. <a href="index.html">Volte para a busca</a>.
        </p>
      `;
      return;
    }

    renderizarDetalhes(carta);
  } catch (erro) {
    console.error('Erro ao carregar detalhes da carta:', erro);
    detalheContainer.innerHTML = `
      <p class="text-danger">
        Erro ao carregar os dados. Tente novamente.
      </p>
    `;
  }
});

function getCardImageUrl(card) {
  const ptbrTranslation = card.foreignNames?.find(fn => fn.language === "Portuguese (Brazil)");
  if (ptbrTranslation && ptbrTranslation.imageUrl) return ptbrTranslation.imageUrl;
  if (card.imageUrl) return card.imageUrl;
  if (card.multiverseid) return `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`;
  return 'placeholder.png';
}

function formatarCustoDeMana(manaCost) {
  if (!manaCost) return 'N/A';
  return manaCost.match(/\{(.*?)\}/g)?.map(simbolo => {
    const key = simbolo.replace(/\{|\}/g, '');
    return key;
  }).join(' ') || 'N/A';
}

function renderizarDetalhes(carta) {
  const detalheContainer = document.getElementById('detalhe-container');
  const traducao = carta.foreignNames?.find(fn => fn.language === "Portuguese (Brazil)");
  const nome = traducao?.name || carta.name;
  const texto = traducao?.text || carta.text;
  const tipo = traducao?.type || carta.type;
  const sabor = traducao?.flavor || carta.flavor;
  const imageUrl = getCardImageUrl(carta);

  const detalhesHTML = `
    <div class="col-lg-4 text-center">
      <img src="${imageUrl}" class="img-fluid rounded shadow-sm" alt="${nome}">
    </div>
    <div class="col-lg-8">
      <h2 class="mb-3">${nome}</h2>
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <strong>Custo de Mana:</strong>
          <span>${formatarCustoDeMana(carta.manaCost)}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <strong>Tipo:</strong>
          <span>${tipo}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <strong>Raridade:</strong>
          <span>${carta.rarity}</span>
        </li>
        ${carta.power ? `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <strong>Poder/Resistência:</strong>
          <span>${carta.power}/${carta.toughness}</span>
        </li>` : ''}
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <strong>Artista:</strong>
          <span>${carta.artist}</span>
        </li>
      </ul>
      ${texto ? `<div class="mt-4"><p class="fw-bold">Texto:</p><p>${texto.replace(/\n/g, ' ')}</p></div>` : ''}
      ${sabor ? `<blockquote class="blockquote mt-4"><p class="flavor-text">"${sabor}"</p></blockquote>` : ''}
    </div>
  `;
  detalheContainer.innerHTML = detalhesHTML;
}
