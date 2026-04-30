// Active/désactive le champ quantité selon la checkbox
function toggle(id) {
  const input = document.getElementById(id);
  const check = document.getElementById('ck_' + id);
  input.disabled = !check.checked;
}

// Formatte un nombre en "X,XX €"
function eur(n) { return n.toFixed(2).replace('.', ',') + ' €'; }


// =============================================
// GÉNÉRATION DU DEVIS — déclenché par le bouton
// =============================================
function genererDevis() {

  // Infos client
  document.getElementById('dvClient').textContent = document.getElementById('clientNom').value    || 'Client non renseigné';
  document.getElementById('dvContact').textContent = document.getElementById('clientContact').value || '';
  document.getElementById('dvSiret').textContent  = document.getElementById('clientSiret').value
    ? 'Siret : ' + document.getElementById('clientSiret').value : '';
  document.getElementById('dvDate').textContent   = document.getElementById('devisDate').value;

  // Numéro de devis : celui saisi, sinon rien
  const numSaisi = document.getElementById('devisNumero').value.trim();
  document.getElementById('dvNumero').textContent = numSaisi;

  const tbody = document.getElementById('dvTableau');
  tbody.innerHTML = '';
  let total = 0;

  // Ajoute un titre de section dans le tableau
  function section(titre) {
    tbody.innerHTML += `<tr class="section-row"><td colspan="4">${titre}</td></tr>`;
  }

  // Ajoute une ligne produit
  // Lit data-prix, data-label, data-unite depuis l'input HTML
  function ligne(id, qte, pu, label, unite) {
    const st = qte * pu;
    tbody.innerHTML += `<tr>
      <td>${label}</td>
      <td style="text-align:center;">${qte} ${unite}</td>
      <td style="text-align:right;">${eur(pu)}</td>
      <td style="text-align:right;">${eur(st)}</td>
    </tr>`;
    total += st;
  }

  // Impression — copies et masters
  const impression = ['copies', 'masters'].filter(id => document.getElementById('ck_' + id).checked);
  if (impression.length) {
    section('Impression');
    impression.forEach(id => {
      const el = document.getElementById(id);
      ligne(id, +el.value, +el.dataset.prix, el.dataset.label, el.dataset.unite);
    });
  }

  // Papiers
  // ← Pour ajouter un papier : ajouter son id ici ET une .ligne dans le HTML
  const papierIds = ['cf80','cf160','m115','m170','m300','cy80','cy90','cy115','cy170','cy250'];
  const papiers = papierIds.filter(id => document.getElementById('ck_' + id).checked);
  if (papiers.length) {
    section('Papier A3');
    papiers.forEach(id => {
      const el = document.getElementById(id);
      ligne(id, +el.value, +el.dataset.prix, el.dataset.label, el.dataset.unite);
    });
  }

  // Main d'œuvre
  const moIds = ['mo_cdp','mo_coulisse','mo_adherent','mo_exterieur'];
  const mo = moIds.filter(id => document.getElementById('ck_' + id).checked);
  if (mo.length) {
    section("Main d'œuvre");
    mo.forEach(id => {
      const el = document.getElementById(id);
      ligne(id, +el.value, +el.dataset.prix, el.dataset.label, el.dataset.unite);
    });
  }

  // Adhésion — forfait fixe 10€, pas de quantité
  if (document.getElementById('ck_adhesion').checked) {
    section('Adhésion');
    tbody.innerHTML += `<tr>
      <td>Adhésion atelier Riso CDP</td>
      <td style="text-align:center;">1 an</td>
      <td style="text-align:right;">${eur(10)}</td>
      <td style="text-align:right;">${eur(10)}</td>
    </tr>`;
    total += 10;
  }

  // Bloc total
  document.getElementById('dvTotal').innerHTML = `
    <div><span>Total HT</span><span>${eur(total)}</span></div>
    <div><span>TVA (non applicable)</span><span>—</span></div>
    <div class="grand"><span>TOTAL TTC</span><span>${eur(total)}</span></div>
  `;

  // Commentaire — masqué si vide
  const comment = document.getElementById('commentaire').value.trim();
  document.getElementById('dvNote').style.display    = comment ? 'block' : 'none';
  document.getElementById('dvNoteTexte').textContent = comment;

  window.print();
}

// Date du jour remplie automatiquement à l'ouverture
document.getElementById('devisDate').value = new Date().toLocaleDateString('fr-FR');
