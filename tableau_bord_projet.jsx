import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const burndownData = [
  { sprint: "S1", ideale: 100, reelle: 100 },
  { sprint: "S2", ideale: 88, reelle: 90 },
  { sprint: "S3", ideale: 75, reelle: 80 },
  { sprint: "S4", ideale: 63, reelle: 72 },
  { sprint: "S5", ideale: 50, reelle: 58 },
  { sprint: "S6", ideale: 38, reelle: 40 },
  { sprint: "S7", ideale: 25, reelle: 28 },
  { sprint: "S8", ideale: 13, reelle: null },
  { sprint: "S9", ideale: 0, reelle: null },
];

const jalons = [
  { nom: "Kick-off et RACI validée", date: "Jan 2026", statut: "ok", source: "Organigramme projet" },
  { nom: "UUID unifié et PredictX connecté", date: "Fév 2026", statut: "ok", source: "Annexe 23 du dossier" },
  { nom: "POC PredictX go/no-go", date: "Mar 2026", statut: "warning", source: "Annexe 25 du dossier" },
  { nom: "Feature store RecommAI actif", date: "Avr 2026", statut: "pending", source: "Annexe 23 du dossier" },
  { nom: "Extension RecommAI T2", date: "Mai 2026", statut: "pending", source: "Annexe 23 du dossier" },
  { nom: "Bilan semestriel S1", date: "Juin 2026", statut: "pending", source: "Calendrier instances" },
];

const livrables = [
  { nom: "Campagnes Meta et Google S1", budget: 18000, consomme: 14200, source: "Annexe 8 dossier Bloc 1" },
  { nom: "POC PredictX (additionnel)", budget: 12100, consomme: 8600, source: "Annexe 26 du dossier" },
  { nom: "Partenariats influenceurs", budget: 12000, consomme: 9800, source: "Annexe 8 dossier Bloc 1" },
  { nom: "Production contenus studio", budget: 14000, consomme: 7200, source: "Annexe 8 dossier Bloc 1" },
  { nom: "Relations presse", budget: 8000, consomme: 5100, source: "Annexe 8 dossier Bloc 1" },
  { nom: "Evenementiel et salons", budget: 5000, consomme: 2400, source: "Annexe 8 dossier Bloc 1" },
];

const totalBudget = 98000 + 12100;
const totalConsomme = livrables.reduce((a, b) => a + b.consomme, 0);
const pct = Math.round((totalConsomme / totalBudget) * 100);

const rseKpis = [
  {
    label: "tCO2 evitees",
    valeur: 3.2,
    cible: 6.0,
    unite: "t",
    source: "CDP Natuveris Box, champ impact_co2_saved",
    frequence: "Mensuelle",
    color: "#27ae60",
    bg: "#EAF3DE",
  },
  {
    label: "Part fournisseurs inclusifs (ESAT)",
    valeur: 7,
    cible: 10,
    unite: "%",
    source: "Contrat cadre ESAT, reporting Logistique",
    frequence: "Mensuelle",
    color: "#2980b9",
    bg: "#E6F1FB",
  },
  {
    label: "Score satisfaction equipes",
    valeur: 3.8,
    cible: 4.5,
    unite: "/5",
    source: "Mini-sondage flash bimestriel",
    frequence: "Bimestrielle",
    color: "#8e44ad",
    bg: "#EEEDFE",
  },
  {
    label: "Conformite WCAG 2.1 AA",
    valeur: 94,
    cible: 100,
    unite: "%",
    source: "Audit accessibilite RSE et Qualite",
    frequence: "Par envoi POC",
    color: "#16a085",
    bg: "#E1F5EE",
  },
];

function StatutBadge({ statut }) {
  const map = {
    ok: { bg: "#EAF3DE", color: "#27500A", label: "Termine" },
    warning: { bg: "#FFF3CD", color: "#7D4E00", label: "En cours" },
    pending: { bg: "#F5F5F3", color: "#555", label: "A venir" },
  };
  const s = map[statut];
  return (
    <span style={{
      fontSize: 8, fontWeight: 700, padding: "2px 8px",
      borderRadius: 8, background: s.bg, color: s.color,
      border: `1px solid ${s.color}`,
    }}>
      {s.label}
    </span>
  );
}

function Jauge({ valeur, cible, color, unite }) {
  const pct = Math.min(Math.round((valeur / cible) * 100), 100);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{valeur}{unite}</span>
        <span style={{ fontSize: 9, color: "#aaa" }}>Cible : {cible}{unite}</span>
      </div>
      <div style={{ height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: color, borderRadius: 4,
          transition: "width 0.3s",
        }} />
      </div>
      <div style={{ fontSize: 8, color: "#aaa", marginTop: 3, textAlign: "right" }}>{pct}% de l'objectif</div>
    </div>
  );
}

function SectionTitle({ children, color }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color: color || "#1B4332",
      textTransform: "uppercase", letterSpacing: "0.06em",
      marginBottom: 12, paddingBottom: 6,
      borderBottom: `2px solid ${color || "#1B4332"}`,
    }}>
      {children}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      border: "0.5px solid #e0e0e0",
      padding: "16px 18px",
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function TableauBord() {
  const [activeVolet, setActiveVolet] = useState("delais");

  const tabs = [
    { id: "delais", label: "Volet 1 : Pilotage delais", color: "#2980b9" },
    { id: "budget", label: "Volet 2 : Pilotage budget", color: "#534AB7" },
    { id: "rse", label: "Volet 3 : RSE et engagement", color: "#27ae60" },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f6f3", padding: 24, minHeight: "100vh" }}>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1B4332", marginBottom: 3 }}>
          Tableau de bord projet : Natuveris Box 2026
        </div>
        <div style={{ fontSize: 9, color: "#888" }}>
          Agence Horizon · Bloc 4 Q2.2 · Mise a jour : hebdomadaire (delais et budget) · bimestrielle (RSE)
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveVolet(tab.id)}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "none",
              cursor: "pointer", fontSize: 9, fontWeight: 700,
              background: activeVolet === tab.id ? tab.color : "#fff",
              color: activeVolet === tab.id ? "#fff" : "#555",
              boxShadow: activeVolet === tab.id ? `0 2px 8px ${tab.color}40` : "none",
              border: `1px solid ${activeVolet === tab.id ? tab.color : "#ddd"}`,
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* VOLET 1 : DELAIS */}
      {activeVolet === "delais" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

          <Card style={{ gridColumn: "1 / -1" }}>
            <SectionTitle color="#2980b9">Courbe d'epuisement (Burndown)</SectionTitle>

            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={burndownData}>
                <XAxis dataKey="sprint" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} unit="%" />
                <Tooltip formatter={(v) => v !== null ? `${v}%` : "A venir"} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Line type="monotone" dataKey="ideale" stroke="#ddd" strokeDasharray="5 4" dot={false} name="Ideale" />
                <Line type="monotone" dataKey="reelle" stroke="#2980b9" strokeWidth={2} dot={{ r: 3 }} name="Reelle" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 8, color: "#e67e22", marginTop: 6, fontWeight: 600 }}>
              Ecart sprint S4 : +9 points vs trajectoire ideale. Seuil d'alerte franchi si ecart superieur a 15 points sur 2 sprints consecutifs.
            </div>
          </Card>

          <Card>
            <SectionTitle color="#2980b9">Avancement des jalons</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {jalons.map((j, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "#f8f9f7", borderRadius: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "#333", marginBottom: 2 }}>{j.nom}</div>
                    <div style={{ fontSize: 8, color: "#aaa" }}>{j.date}</div>
                  </div>
                  <StatutBadge statut={j.statut} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle color="#2980b9">Velocite par sprint</SectionTitle>

            {[
              { sprint: "Sprint 1", points: 11, cible: 12 },
              { sprint: "Sprint 2", points: 10, cible: 12 },
              { sprint: "Sprint 3", points: 9, cible: 12 },
              { sprint: "Sprint 4", points: 13, cible: 12 },
              { sprint: "Sprint 5", points: 12, cible: 12 },
              { sprint: "Sprint 6", points: 14, cible: 12 },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, color: "#333" }}>{s.sprint}</span>
                  <span style={{ color: s.points >= s.cible ? "#27ae60" : "#e74c3c", fontWeight: 700 }}>
                    {s.points} pts
                  </span>
                </div>
                <div style={{ height: 6, background: "#eee", borderRadius: 3 }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min((s.points / 16) * 100, 100)}%`,
                    background: s.points >= s.cible ? "#27ae60" : "#e74c3c",
                    borderRadius: 3,
                  }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 8, color: "#888", marginTop: 8, borderTop: "0.5px solid #eee", paddingTop: 6 }}>
              Cible : 12 points/sprint · Velocite moyenne actuelle : 11,5 pts
            </div>
          </Card>

        </div>
      )}

      {/* VOLET 2 : BUDGET */}
      {activeVolet === "budget" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

          <Card>
            <SectionTitle color="#534AB7">Budget global consomme</SectionTitle>

            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#534AB7" }}>{pct}%</span>
              <div style={{ fontSize: 9, color: "#888" }}>consomme</div>
            </div>
            <div style={{ height: 12, background: "#eee", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
              <div style={{
                height: "100%",
                width: `${pct}%`,
                background: pct > 80 ? "#e74c3c" : pct > 60 ? "#e67e22" : "#534AB7",
                borderRadius: 6,
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5 }}>
              <span style={{ color: "#534AB7", fontWeight: 700 }}>{totalConsomme.toLocaleString("fr-FR")} €</span>
              <span style={{ color: "#aaa" }}>sur {totalBudget.toLocaleString("fr-FR")} €</span>
              <span style={{ color: "#27ae60", fontWeight: 700 }}>Reste : {(totalBudget - totalConsomme).toLocaleString("fr-FR")} €</span>
            </div>

          </Card>

          <Card>
            <SectionTitle color="#534AB7">Alertes budgetaires</SectionTitle>

            {[
              { label: "CAC Meta Ads", valeur: "74 €", seuil: "80 €", statut: "ok" },
              { label: "CAC Google Ads", valeur: "36 €", seuil: "40 €", statut: "warning" },
              { label: "Taux de retention", valeur: "76 %", seuil: "73 %", statut: "ok" },
              { label: "Ecart budget PredictX", valeur: "3,2 %", seuil: "5 %", statut: "ok" },
            ].map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 10px", borderRadius: 6, marginBottom: 6,
                background: a.statut === "warning" ? "#FFF3CD" : "#f8f9f7",
                border: `0.5px solid ${a.statut === "warning" ? "#EFC060" : "#eee"}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: "#333" }}>{a.label}</div>
                  <div style={{ fontSize: 8, color: "#aaa" }}>Seuil : {a.seuil}</div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: a.statut === "warning" ? "#7D4E00" : "#27ae60",
                }}>
                  {a.valeur}
                </span>
              </div>
            ))}
          </Card>

          <Card style={{ gridColumn: "1 / -1" }}>
            <SectionTitle color="#534AB7">Cout par livrable</SectionTitle>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {livrables.map((l, i) => {
                const p = Math.round((l.consomme / l.budget) * 100);
                const alerte = p > 85;
                return (
                  <div key={i} style={{
                    padding: "10px 12px", borderRadius: 8,
                    background: alerte ? "#FFF3CD" : "#f8f9f7",
                    border: `0.5px solid ${alerte ? "#EFC060" : "#eee"}`,
                  }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#333", marginBottom: 4 }}>{l.nom}</div>
                    <div style={{ height: 5, background: "#e0e0e0", borderRadius: 3, marginBottom: 5 }}>
                      <div style={{ height: "100%", width: `${p}%`, background: alerte ? "#e67e22" : "#534AB7", borderRadius: 3 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8 }}>
                      <span style={{ color: "#534AB7", fontWeight: 600 }}>{l.consomme.toLocaleString("fr-FR")} €</span>
                      <span style={{ color: "#aaa" }}>{p}%</span>
                      <span style={{ color: "#27ae60" }}>Reste : {(l.budget - l.consomme).toLocaleString("fr-FR")} €</span>
                    </div>

                  </div>
                );
              })}
            </div>
          </Card>

        </div>
      )}

      {/* VOLET 3 : RSE */}
      {activeVolet === "rse" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

          {rseKpis.map((kpi, i) => (
            <Card key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: kpi.color, flexShrink: 0,
                }} />
                <div style={{ fontSize: 10, fontWeight: 700, color: "#1a1a1a" }}>{kpi.label}</div>
              </div>
              <Jauge valeur={kpi.valeur} cible={kpi.cible} color={kpi.color} unite={kpi.unite} />
            </Card>
          ))}

          <Card style={{ gridColumn: "1 / -1" }}>
            <SectionTitle color="#27ae60">Seuils d'alerte RSE et actions declenchees</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {[
                {
                  kpi: "tCO2 evitees inferieur a 50 % de la cible a mi-parcours",
                  action: "Revue des fournisseurs avec RSE et Qualite · Audit empreinte carbone commandes ESAT",
                  color: "#27ae60",
                },
                {
                  kpi: "Part ESAT inferieure a 8 % deux mois consecutifs",
                  action: "Plan de rattrapage en COPIL mensuel · Revision contrat cadre ESAT avant bilan semestriel",
                  color: "#2980b9",
                },
                {
                  kpi: "Score satisfaction inferieur a 3/5 deux bimestres consecutifs",
                  action: "Declenchement seuil d'alerte R9 · Repriorisation backlog Data sans attendre le COPIL",
                  color: "#8e44ad",
                },
                {
                  kpi: "Conformite WCAG inferieure a 100 % sur un envoi POC",
                  action: "Blocage mise en production · Correction IT/PWA sous 48h · RSE et Qualite valide avant relance",
                  color: "#16a085",
                },
              ].map((a, i) => (
                <div key={i} style={{
                  padding: "10px 12px", borderRadius: 8,
                  background: "#f8f9f7", border: `0.5px solid #eee`,
                }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, color: "#333", marginBottom: 5 }}>
                    Si : {a.kpi}
                  </div>
                  <div style={{ fontSize: 8.5, color: "#555", lineHeight: 1.5 }}>
                    Alors : {a.action}
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      )}



    </div>
  );
}
