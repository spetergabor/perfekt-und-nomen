// OsdData.js

// 1. RÉSZLETES VIZSGALEÍRÁS (A POPUP-HOZ)
export const examInfo = {
    title: "ÖSD B2 Vizsgaleírás",
    sections: [
        {
            icon: "📖",
            name: "Leseverstehen (90 perc)",
            desc: "Összesen 90 perc áll rendelkezésre a 4 feladat megoldásához. A sorrend tetszőleges.",
            details: [
                "1. feladat: Hosszabb szöveg, feleletválasztós kérdéssor. (5 pont)",
                "2. feladat: 10 cím hozzárendelése 5 rövid szöveghez. (5 pont)",
                "3. feladat: Lückentext (nyitott). Önálló kiegészítés, max 3 betűs szavak! (5 pont)",
                "4. feladat: Hiányos szöveg (pl. hirdetés) pótlása ragozással. (5 pont)"
            ]
        },
        {
            icon: "🎧",
            name: "Hörverstehen (kb. 30 perc)",
            desc: "A feladatok sorrendje követi a szövegét. Max. 20 pont.",
            details: [
                "1. feladat: Rádióműsor/interjú. 10 igaz/hamis állítás. 2-szer hallgatható. (10 pont)",
                "2. feladat: Beszélgetés egy szituációról. Táblázat kitöltése adatokkal. Csak 1-szer hallgatható! (10 pont)"
            ]
        },
        {
            icon: "✍️",
            name: "Schreiben (90 perc)",
            desc: "Két feladatot kell megoldani, összesen 30 pont.",
            details: [
                "1. feladat: Panaszlevél írása megadott szempontok alapján (min. 120 szó). (15 pont)",
                "2. feladat: Véleménykifejtés (A, B vagy C téma közül választva). (min. 120 szó). (15 pont)"
            ]
        },
        {
            icon: "🗣️",
            name: "Sprechen (15 perc felkészülés + 15 perc vizsga)",
            desc: "Szótár használható a felkészülés alatt. Max. 30 pont.",
            details: [
                "1. feladat: Ismerkedés és tanácsadás (szituációs gyakorlat).",
                "2. feladat: Kép értelmezése és leírása (3 kép közül választva).",
                "3. feladat: Saját vélemény kifejtése és vita a vizsgáztatóval."
            ]
        }
    ]
};

// 2. LÜCKENTEXT FELADATOK
export const lueckenTasks = [
    { 
        textBefore: "Trotz des schlechten Wetters", 
        textAfter: "wir uns für einen Spaziergang.", 
        correct: "entschieden", 
        explanation: "Sich entscheiden für + Akk (Múlt idő: entschied/entschieden)" 
    },
    { 
        textBefore: "Ich freue mich sehr", 
        textAfter: "deine Einladung zum Abendessen.", 
        correct: "über", 
        explanation: "Sich freuen über + Akk (már megtörtént dolog)" 
    },
    { 
        textBefore: "Könntest du mir bitte", 
        textAfter: "helfen, die schweren Koffer zu tragen?", 
        correct: "dabei", 
        explanation: "Präpositionaladverb: helfen dabei, etwas zu tun" 
    },
    { 
        textBefore: "Es hängt ganz", 
        textAfter: "ab, ob wir morgen früher anfangen können.", 
        correct: "davon", 
        explanation: "Abhängen von + Dativ (davon: attól)" 
    }
];

// 3. LESEVERSTEHEN SZÖVEG ÉS KÉRDÉSEK
export const leseTasks = [
    {
        question: "Virtuelle Fachhochschulen",
        options: [
            { id: 'A', text: "sind beliebt." },
            { id: 'B', text: "entstehen rasch." },
            { id: 'C', text: "sind in allen Studienfächern erreichbar." }
        ],
        correct: 'A'
    },
    {
        question: "Das Studium ist beliebt, weil",
        options: [
            { id: 'A', text: "man sich dadurch vieles ersparen kann." },
            { id: 'B', text: "Parkplatzprobleme keine Rolle spielen." },
            { id: 'C', text: "es finanziell günstiger ist." }
        ],
        correct: 'A'
    },
    {
        question: "Durch das PC-Studium",
        options: [
            { id: 'A', text: "gehen alle Hausarbeiten leichter von der Hand." },
            { id: 'B', text: "können die Haushaltsarbeiten leichter erledigt werden." },
            { id: 'C', text: "wird es Frauen erleichtert, zu Hause zu bleiben." }
        ],
        correct: 'C'
    },
    {
        question: "Es gibt einige Voraussetzungen zum Studium, zum Beispiel: Man sollte",
        options: [
            { id: 'A', text: "ständig ein freies Wochenende haben." },
            { id: 'B', text: "einen hilfsbereiten Mann haben." },
            { id: 'C', text: "vor allem zielbewusst tätig sein." }
        ],
        correct: 'C'
    },
    {
        question: "Man muss nicht unbedingt einsam arbeiten,",
        options: [
            { id: 'A', text: "weil die Professoren zu den Studenten Kontakt haben." },
            { id: 'B', text: "da neue Kontaktarten verwendet werden." },
            { id: 'C', text: "weil die Professoren zwei Termine fürs persönliche Treffen haben." }
        ],
        correct: 'B'
    }
];

// 4. LESEVERSTEHEN TELJES SZÖVEGE
export const leseText = {
    title: "Alltag einer Online-Studentin",
    subtitle: "Weiterbildung am heimischen Computer",
    content: `
            <p><strong>Studium und Weiterbildung</strong> trotz Berufstätigkeit und familiärer Verantwortung? „Für mich ist das Online-Studium die ideale Möglichkeit Familie und Studium unter einen Hut zu kriegen“, sagt Gabriele Flor, 42. Nach einer Ausbildung als Krankenschwester und einem Studium der Humanbiologie an einer Präsenzhochschule studiert sie seit 2001 Medieninformatik an der Virtuellen Fachhochschule Lübeck – zusammen mit 25 Kommilitonen im Alter zwischen Anfang 20 und Ende 40 aus Wien, Trier oder dem Ruhrgebiet.</p>
              
              <p><strong>Seit Sommer 2001 haben</strong> sich sieben Präsenzhochschulen aus seis Bundesländern zum Verbund Virtuelle Fachhochschule zusammengeschlossen. Die von der Fachhochschule Lübeck Ende 2003 gegründete oncampus GmbH betreibt dieses Online-Angebot. Mit oncampus können Studierende via Internet die Online-Fernstudiengänge Medieninformatik und Wirtschaftsingenieurwesen vagy auch nur einzelne wissenschaftliche Module absolvieren. Weitere Masterstudiengänge wie „Industrial Engineering“ sind in Vorbereitung.</p>
              
              <p>Gabriele Flor gehört zu den „Pionierinnen der ersten Stunde“ – und hat darüber hinaus den Vergleich zwischen beiden Studienmöglichkeiten. „Ich spare vor allem Zeit und Geld, indem ich keine langen Anfahrtswege habe und die nervige Parkplatzsuche entfällt. Die Gebühren pro Modul und die Grundgebühr pro Semester empfinde ich als Moderat, zumal wenn man bedenkt, dass ich mir kein Zimmer oder keine Wohnung mieten muss“, erklärt die Studentin. „Und außerdem macht das multimediale Lernen am PC vor allem einfach Spaß“, ergänzt ihre Kollegin Kristin Rentzsch, 39, die unter anderem auch die Freude am Umgang mit dem Medium Internet motiviert hat, sich für das Studium zu bewerben.</p>
              
              <p><strong>Wie also sieht ein typischer Tag einer Online-Studentin aus?</strong><br>Bei Gabriele Flor läuft er folgendermaßen ab: Sie steht um 6:30 Uhr auf, kümmert sich um die beiden schulpflichtigen Kinder und erledigt einen Teil des Haushaltes, bis sie sich dann von 8:00 bis 12:00 Uhr an den Schreibtisch setzt. Anschließend ist dann erst einmal Familie, Haushalt und Garten angesagt, und von 20.30 bis 22.30 wird wieder am PC gelernt.</p>
              
              <p>„Bei mir gestaltet sich das Programm anders, weil ich vormittags als Informatikkauffrau in einer Firma für Telekommunikation tätig bin“, berichtet Kristin Rentzsch, die ebenfalls Mutter von zwei Schulkindern ist und ursprünglich einmal als Medizinisch-Technische Assistentin tätig war. Nachmittags stehen bei ihr Kinder, Haushalt und Sport auf der Aufgabenliste, und abends ist dann die Zeit wieder von 21.00 bis 23.00 Uhr für das Lernen am Schreibtisch reserviert. Beide Frauen nutzen außerdem noch oft die Zeit am Wochenende für sie, wobei dann jeweils die Männer den familiären Part übernehmen. „Ein gewisses Maß an Organisationsstärke, Zeit- und Selbstmanagement sollte schon vorhanden sein, wenn man im Studium vorankommen möchte“, gibt Gabriele Flor zu bedenken. Aber am wichtigsten sei der generelle Spaß am Lernen, verbunden mit den Fortschritten in der persönlichen Entwicklung. Der Rest liefe dann schon – fast – wie von allein.</p>
              
              <p><strong>Studieren im stillen Kämmerlein</strong><br>Stellt sich noch die Frage: Ist man als Studierende allein im stillen Kämmerlein nicht schrecklich einsam? „Ach was, kein Stück, ganz im Gegenteil“, entgegnen die beiden mit Nachdruck. „Wer möchte, kann ganz viel Kontakt untereinander, aber auch zu den Professoren haben. Es ist eine sehr abwechslungsreiche Mischung aus Chatten, Mailen, Telefonieren und persönlichen Treffen bei den Präsenzveranstaltungen, zu denen im Semester immer zwei Termine pro Fach gehören. Da seien die festen Zeiten im virtuellen Klassenzimmer gemeinsam mit der Online-Mentorin, um Fragen zu klären oder in Gruppen Aufgaben zu bearbeiten. Und dann hätte sich da ja auch noch im Laufe der Zeit ein kleines Netzwerk von zehn Leuten gebildet, dass sich online, telefonisch oder bei den Präsenzveranstaltungen gegenseitig beim Lernen hilft und motiviert.</p>
    `
};

// 5. SCHREIBEN FELADATOK
export const schreibenTasks = [
    {
        id: 1,
        title: "Aufgabe 1: Beschwerdebrief",
        situation: "Sie haben einen Intensivsprachkurs in Wien besucht. Leider waren Sie mit dem Kurs und der Unterbringung gar nicht zufrieden.",
        adPoints: [
            "Kleine Gruppen (max. 5 Personen)",
            "Modernes Sprachlabor & kostenloses Material",
            "Zentrale Unterkunft (Einzelzimmer)",
            "Abwechslungsreiches Freizeitprogramm"
        ],
        instructions: "Schreiben Sie eine Beschwerde an die Kursleitung. Behandeln Sie mindestens drei Punkte. Vergessen Sie nicht Anrede, Einleitung, Schluss und Grußformel. (Mind. 120 Wörter)",
        usefulPhrases: [
            "Ich schreibe Ihnen, um mich über ... zu beschweren.",
            "In Ihrer Anzeige stand, dass ..., aber in Realität ...",
            "Dies entsprach keineswegs meinen Erwartungen.",
            "Ich bin sehr enttäuscht darüber, dass ...",
            "Aus diesen Gründen erwarte ich eine angemessene Rückerstattung."
        ]
    }
];