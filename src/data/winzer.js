import { WINE_TYPE } from './wineTypes'

// ─── WINZER COLLECTION DATA ─────────────────────────────────────────────────
// Each wine carries an explicit `type` so pairing/ collection UI can branch
// on a value (not on string-matching the wine name).

export const WINZER_DATA = [
  {
    id: 'schneider',
    name: 'Weingut Markus Schneider',
    region: 'Pfalz · Deutschland',
    tagline: 'Pionier. Ikone. Pfalz.',
    desc: 'Innerhalb von 25 Jahren von 1 auf 92 Hektar — Markus Schneider gilt als herausragendstes Talent der deutschen Weinszene. Mit Blackprint und Ursprung hat er Meilensteine gesetzt.',
    reward: 'Persönliche Einladung zur Schneider Vinothek + Signature-Flasche "El Numero Uno"',
    wines: [
      { id: 's1', year: '2025', name: 'Kaitui Sauvignon Blanc',           type: WINE_TYPE.WEISS, desc: 'Cassis, Stachelbeere, Kiwi — Neuseeländischer Stil aus der Pfalz.' },
      { id: 's2', year: '2025', name: 'Rosé Saigner',                      type: WINE_TYPE.ROSE,  desc: 'Saignée-Methode. Brombeere, Cassis, Himbeere — expressiv und spannungsvoll.' },
      { id: 's3', year: '2024', name: 'Blackprint',                        type: WINE_TYPE.ROT,   desc: 'Deutschlands bekanntester Rotwein. Kraft und Eleganz in einem.' },
      { id: 's4', year: '2025', name: 'Ursprung Weißburgunder',            type: WINE_TYPE.WEISS, desc: 'Zurück zu den Wurzeln — mineralisch, frisch, unverwechselbar.' },
      { id: 's5', year: '2024', name: 'Ma Terre Blanc',                    type: WINE_TYPE.WEISS, desc: 'Grauburgunder und Weißburgunder — die Pfalz von ihrer elegantesten Seite.' },
      { id: 's6', year: '2024', name: 'El Numero Uno Riesling',            type: WINE_TYPE.WEISS, desc: 'Der Signature-Riesling. Limitiert. Nur für treue Kunden.' },
      { id: 's7', year: '2023', name: 'Pinot Noir Reserve',                type: WINE_TYPE.ROT,   desc: 'Spätburgunder aus alten Reben — samtig, komplex, lagerfähig.' },
      { id: 's8', year: '2025', name: 'Aufwind Riesling',                  type: WINE_TYPE.WEISS, desc: 'Frisch, mineralisch, trinkfreudig — der Einstieg in die Schneider-Welt.' },
    ],
  },
  {
    id: 'metzger',
    name: 'Weingut Uli Metzger',
    region: 'Pfalz · Deutschland',
    tagline: 'Weingut des Jahres 2026.',
    desc: 'Auf den Etiketten prangt ein Tier — doch hinter dem Humor steckt Spitzenqualität. Uli Metzger aus Asselheim zählt zu den Spitzenbetrieben der Pfalz. Weingut des Jahres 2026 (Gault & Millau).',
    reward: 'Probierset der 3 besten Jahrgänge + handgeschriebene Widmung von Uli Metzger',
    wines: [
      { id: 'm1', year: '2025', name: "Grafenstück Winner's Selection Grauburgunder", type: WINE_TYPE.WEISS, desc: 'Weich, feingliedrig mit kühler Eleganz. GOLD Medaille Berliner Wein Trophy.' },
      { id: 'm2', year: '2025', name: 'Grafenstück Riesling trocken',     type: WINE_TYPE.WEISS, desc: 'Mineralisch, präzise, mit feiner Würze — der Klassiker aus dem Grafenstück.' },
      { id: 'm3', year: '2024', name: 'Vom Feinsten Grauburgunder',       type: WINE_TYPE.WEISS, desc: 'Rheinessens bestes Preis-Leistungs-Verhältnis im Burgunder-Segment.' },
      { id: 'm4', year: '2025', name: 'Das ist... Weißburgunder',         type: WINE_TYPE.WEISS, desc: 'Unkompliziert und immer wieder ein Genuss. Frisch und aromatisch.' },
      { id: 'm5', year: '2024', name: 'Grafenstück Pinot Noir',           type: WINE_TYPE.ROT,   desc: 'Der rote Star aus dem Grafenstück — Eleganz trifft Tiefe.' },
      { id: 'm6', year: '2025', name: 'Stier Grauburgunder Réserve',      type: WINE_TYPE.WEISS, desc: 'Der Premium-Grauburgunder aus dem Hause Metzger. Für besondere Anlässe.' },
      { id: 'm7', year: '2025', name: 'Chardonnay trocken',               type: WINE_TYPE.WEISS, desc: 'International, clean, elegant — Metzgers Hommage an Burgund.' },
      { id: 'm8', year: '2025', name: 'Rosé trocken',                     type: WINE_TYPE.ROSE,  desc: 'Frisch, fruchtig, unkompliziert — Sommer in der Flasche.' },
    ],
  },
  {
    id: 'dreissigacker',
    name: 'Dreissigacker',
    region: 'Rheinhessen · Deutschland',
    tagline: 'Nachhaltigkeit. Präzision. Rheinhessen.',
    desc: 'Jochen Dreissigacker ist einer der aufregendsten Winzer Deutschlands. Biodynamischer Anbau, natürliche Weine, internationale Anerkennung. Rheinhessen von seiner besten Seite.',
    reward: 'VIP-Einladung zur Dreissigacker Harvest Week + exklusive Magnumflasche aus dem Weinkeller',
    wines: [
      { id: 'd1', year: '2023', name: 'Dreissigacker Riesling',           type: WINE_TYPE.WEISS, desc: 'Der Einstieg — mineralisch, präzise, unverwechselbar Rheinhessen.' },
      { id: 'd2', year: '2023', name: 'Bechtheimer Riesling trocken',     type: WINE_TYPE.WEISS, desc: 'Aus der berühmtesten Einzellage Dreissigackers — komplex und tiefgründig.' },
      { id: 'd3', year: '2023', name: 'Weißburgunder',                    type: WINE_TYPE.WEISS, desc: 'Biodynamisch, klar, lebendig — der perfekte Speisenbegleiter.' },
      { id: 'd4', year: '2023', name: 'Chardonnay',                       type: WINE_TYPE.WEISS, desc: 'Burgundischer Stil aus Rheinhessen — Holz, Butter, Mineralität.' },
      { id: 'd5', year: '2022', name: 'Dreissigacker Rotwein Cuvée',      type: WINE_TYPE.ROT,   desc: 'Kraftvoll, würzig, international — ein Statement in Rot.' },
      { id: 'd6', year: '2023', name: 'Rivaner',                          type: WINE_TYPE.WEISS, desc: 'Unkompliziert, frisch, ehrlich — ein Wein für jeden Tag.' },
      { id: 'd7', year: '2022', name: 'Bechtheimer Spätburgunder',        type: WINE_TYPE.ROT,   desc: 'Pinot Noir aus Rheinhessen — feingliedrig, komplex, langlebig.' },
      { id: 'd8', year: '2023', name: 'Wunderbar Rosé',                   type: WINE_TYPE.ROSE,  desc: '100% Spätburgunder — rosé, lebendig, trocken. Ein Naturwein.' },
    ],
  },
]

// ─── PAIRING LOOKUP ─────────────────────────────────────────────────────────
// Stable mapping from wine type to suggested pairings for the Winzer detail UI.

export const PAIRINGS_BY_TYPE = {
  [WINE_TYPE.ROSE]:       ['Lachs', 'Meeresfrüchte', 'Sommerküche', 'Grillen'],
  [WINE_TYPE.ROT]:        ['Wild', 'Rind', 'Lamm', 'Hartkäse'],
  [WINE_TYPE.WEISS]:      ['Pasta', 'Fisch', 'Geflügel', 'Käse'],
  [WINE_TYPE.CHAMPAGNER]: ['Austern', 'Kaviar', 'Festessen', 'Aperitif'],
}

export function getPairingsForWine(wine) {
  return PAIRINGS_BY_TYPE[wine.type] || PAIRINGS_BY_TYPE[WINE_TYPE.WEISS]
}
