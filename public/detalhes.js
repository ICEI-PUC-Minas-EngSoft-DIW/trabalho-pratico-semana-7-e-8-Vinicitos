document.addEventListener('DOMContentLoaded', async () => {
  const detalheContainer = document.getElementById('detalhe-container');

  const params = new URLSearchParams(window.location.search);
  const cartaId = params.get('id');

  if (!cartaId) {
    detalheContainer.innerHTML = '<p>Nenhuma carta selecionada. <a href="index.html">Volte para a busca</a>.</p>';
    return;
  }

  try {
    const resposta = await fetch('data.json');
    const dados = await resposta.json();
    const todasAsCartas = dados.cards;
    const carta = todasAsCartas.find(c => c.id === cartaId);

    if (!carta) {
      detalheContainer.innerHTML = '<p>Carta não encontrada. <a href="index.html">Volte para a busca</a>.</p>';
      return;
    }

    renderizarDetalhes(carta);

  } catch (erro) {
    console.error('Erro ao carregar detalhes da carta:', erro);
    detalheContainer.innerHTML = '<p>Erro ao carregar os dados. Tente novamente.</p>';
  }
});

function getCardImageUrl(card) {
    const ptbrTranslation = card.foreignNames?.find(fn => fn.language === "Portuguese (Brazil)");
    if (ptbrTranslation && ptbrTranslation.imageUrl) return ptbrTranslation.imageUrl;
    if (card.imageUrl) return card.imageUrl;
    if (card.multiverseid) return `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`;
    return 'placeholder.png'; 
}

function renderizarDetalhes(carta ) {
  const detalheContainer = document.getElementById('detalhe-container');
  
 
  const traducao = carta.foreignNames?.find(fn => fn.language === "Portuguese (Brazil)");
  const nome = traducao?.name || carta.name;
  const texto = traducao?.text || carta.text;
  const tipo = traducao?.type || carta.type;
  const sabor = traducao?.flavor || carta.flavor;

  const imageUrl = getCardImageUrl(carta);


  let detalhesHTML = `
    <div class="detalhe-imagem">
      <img src="${imageUrl}" alt="${nome}">
    </div>
    <div class="detalhe-info">
      <h2>${nome}</h2>
      ${carta.manaCost ? `<p><strong>Custo de Mana:</strong> ${carta.manaCost}</p>` : ''}
      <p><strong>Tipo:</strong> ${tipo}</p>
      ${texto ? `<p><strong>Texto:</strong> ${texto.replace(/\n/g, '  ')}</p>` : ''}
      ${sabor ? `<p class="flavor-text">"${sabor}"</p>` : ''}
      ${carta.power ? `<p><strong>Poder/Resistência:</strong> ${carta.power}/${carta.toughness}</p>` : ''}
      <p><strong>Raridade:</strong> ${carta.rarity}</p>
      <p><strong>Artista:</strong> ${carta.artist}</p>
    </div>
  `;

  detalheContainer.innerHTML = detalhesHTML;
}
