// OsdData.js

export const examInfo = {
    title: "ÖSD B2 Vizsgaleírás",
    sections: [
        {
            icon: "📖",
            name: "Leseverstehen (90 perc)",
            desc: "Összesen 90 perc áll rendelkezésre a 4 feladat megoldásához. Max. 20 pont. (Minimum 10 pont kell a sikerhez)",
            details: [
                "1. feladat: Hosszabb szöveg, feleletválasztós kérdéssor (5 feladat).",
                "2. feladat: 10 cím hozzárendelése 5 rövid szöveghez.",
                "3. feladat: Lückentext (nyitott). Max 3 betűs szórészletek.",
                "4. feladat: Hiányos szöveg pótlása ragozással (grammatika)."
            ]
        },
        {
            icon: "🎧",
            name: "Hörverstehen (kb. 30 perc)",
            desc: "Max. 20 pont. (Minimum 10 pont kell a sikerhez)",
            details: [
                "1. feladat: Rádióműsor/interjú. 10 igaz/hamis állítás.",
                "2. feladat: Beszélgetés egy szituációról. Táblázat kitöltése adatokkal."
            ]
        },
        {
            icon: "✍️",
            name: "Schreiben (90 perc)",
            desc: "Két feladat, összesen 30 pont.",
            details: [
                "1. feladat: Panaszlevél írása (min. 120 szó).",
                "2. feladat: Véleménykifejtés (min. 120 szó)."
            ]
        },
        {
            icon: "🗣️",
            name: "Sprechen (15 perc felkészülés + 15 perc vizsga)",
            desc: "Max. 30 pont.",
            details: [
                "1. feladat: Ismerkedés és tanácsadás.",
                "2. feladat: Kép értelmezése és leírása.",
                "3. feladat: Saját vélemény kifejtése és vita."
            ]
        }
    ]
};

// --- ÚJ LÜCKENTEXT ADATSTRUKTÚRA (TELJES SZÖVEGGEL) ---
export const lueckenTextFull = {
    title: "Weltweit nimmt die Zahl der Übergewichtigen zu",
    parts: [
        { id: 1, text: "London. Der Anteil übergewichtiger Kin", correct: "der" },
        { id: 2, text: " weltweit wird nach Einschätzungen v", correct: "on" },
        { id: 3, text: " Experten in den kommenden Jahren drasti", correct: "sch" },
        { id: 4, text: " ansteigen. In Nord- und Südamerika wi", correct: "rd" },
        { id: 5, text: " bald die Hälfte der Jungen und Mädchen z", correct: "u" },
        { id: 6, text: " dick sein, wie aus einer kürzlich veröff", correct: "ent" },
        { id: 7, text: " lichten Studie hervorgeht. Sollte sich ", correct: "der" }, // A hivatalos vizsgán a "dieser" is elfogadott
        { id: 8, text: " Trend fortsetzen, könnte der Anteil ", correct: "in" },
        { id: 9, text: " der EU demnach bei 38 Prozent liegen. „Wir haben wirklich eine globale Epidem", correct: "ie" },
        { id: 10, text: " die anscheinend die meisten Länder auf ", correct: "der" },
        { id: 11, text: " Welt betrifft“, sagt Philipp James, Dir", correct: "ek" },
        { id: 12, text: " tor des internationalen Forschun", correct: "gs" },
        { id: 13, text: " netzwerkes IOTF. Die beteiligten Wissenschaft", correct: "ler" },
        { id: 14, text: " führen diese Entwicklung unter ander", correct: "em" },
        { id: 15, text: " auf ungesunde Ernährung und zu we", correct: "nig" },
        { id: 16, text: " Bewegung zurück. Speziell Fastfood gerät im", correct: "mer" },
        { id: 17, text: " mehr unter Kritik. Ein Beispiel lief", correct: "ert" },
        { id: 18, text: " die Situation in Japan, wo statt Fisch ", correct: "und" },
        { id: 19, text: " Reis immer häufiger Hamburger und Pom", correct: "mes" },
        { id: 20, text: " frites gegessen werden. Die Folgen si", correct: "nd" }
    ],
    ending: " besonders bei Kindern sichtbar."
};

export const leseTasks = [
    // PDF feladat 1. oldal kérdései
    {
        question: "Die Zugehörigkeit zu einer bestimmten Gruppe",
        options: [
            { id: 'A', text: "wird zusätzlich durch eine Zeichensprache betont." },
            { id: 'B', text: "ist an der Universität besonders wichtig." },
            { id: 'C', text: "wurde schon im Mittelalter durch Mode ausgedrückt." }
        ],
        correct: 'C'
    },
    {
        question: "Studenten und Studentinnen an Wirtschaftsuniversitäten",
        options: [
            { id: 'A', text: "kaufen ihre Kleidung bei österreichischen Designern." },
            { id: 'B', text: "legen viel Wert auf gute Kleidung." },
            { id: 'C', text: "tragen wie Juristen Anzug und Kostüm." }
        ],
        correct: 'B'
    },
    {
        question: "An geisteswissenschaftlichen Fakultäten",
        options: [
            { id: 'A', text: "sind Studierende besonders leicht an ihrer Kleidung zu erkennen." },
            { id: 'B', text: "spielt Kleidung keine besonders große Rolle." },
            { id: 'C', text: "tragen Studierende gern teure Accessoires wie Tücher und Schmuck." }
        ],
        correct: 'B'
    },
    {
        question: "Ruth Glaser meint, dass",
        options: [
            { id: 'A', text: "auch nachlässige Kleidung etwas ausdrückt." },
            { id: 'B', text: "in Workshops der Kleidungsstil von Mitarbeitern verbessert werden kann." },
            { id: 'C', text: "Kleidung vor allem die politische Einstellung zeigt." }
        ],
        correct: 'A'
    },
    {
        question: "Laut Martina Rogy",
        options: [
            { id: 'A', text: "können viele Menschen ihre Kleidung nicht bewusst nutzen." },
            { id: 'B', text: "muss man sich in seinen Kleidern wohlfühlen." },
            { id: 'C', text: "sind Menschen, die Markenkleidung tragen, selbstsicherer." }
        ],
        correct: 'B'
    }
];

export const leseTexts = {
    onlineStudentin: {
        title: "Alltag einer Online-Studentin",
        subtitle: "Weiterbildung am heimischen Computer",
        content: `<p><strong>Studium und Weiterbildung</strong> trotz Berufstätigkeit...</p>`
    },
    universitaetLaufsteg: {
        title: "Styling: Die Universität als Laufsteg der Eitelkeiten",
        subtitle: "Zeig mir, was du trägst, ich sag dir, was du studierst",
        content: `
            <p><strong>Kleider machen bekanntlich Leute</strong> und sind eine beliebte Ausdrucksmöglichkeit der individuellen Persönlichkeit. Doch gerade weil Lebensstil und Interessen über die Kleidung nach außen transportiert werden, wirkt das Outfit oft wie uniformiert.</p>
            
            <p>„UniLive" wollte wissen: Warum sehen eigentlich alle Jus-Studenten gleich aus? Warum denkt man beim Schlagwort Ethnologie an Rastafrisuren und bei Informatik automatisch an schwarze Jeans und weiße Socken? Kleidung fungiert als Code, in einer Art Zeichensprache signalisiert sie die Zugehörigkeit zu einer bestimmten Gruppe.</p>
            
            <p>Schon im Mittelalter galt Mode als Merkmal der Standeszugehörigkeit, auf den heimischen Universitäten signalisiert sie die Zugehörigkeit zu bestimmten Fakultäten: Vom Styling lässt sich also auf die Studienrichtung schließen.</p>
            
            <p>Wirtschaftsstudenten tragen Timberlands oder hochhackige Schuhe, kombiniert mit engen Jeans oder einem kurzen Rock. Dazu tragen sie meist Blusen, möglichst in Pastellfarben, und darüber V-Ausschnitt-Pullover. „Als Accessoires werden Perlenschmuck, eine Tasche von Longchamp und ein Pashmina-Schal getragen." Die Österreichische Designerin Martina Rogy bedient sich bei ihrer Analyse nicht allein am Klischee, der beschriebene Wirtschaftler-Look fällt oft ins Auge.</p>
            
            <p><strong>Anzug oder Wickelhose</strong></p>
            
            <p>„Das Outfit ist eine Imagekomponente", bringt es Stil- und Farbberaterin Ruth Glaser auf den Punkt. „Wirtschaftsstudenten haben eben im Kopf: 'Ich werde Bankdirektor' und kleiden sich dementsprechend gut."</p>
            
            <p>Aber auch auf anderen Fakultäten herrscht der Einheitslook, wobei es Geisteswissenschaftlern, so Rogy, prinzipiell nicht so wichtig ist, wie sie sich kleiden, weil „das Wissen im Vordergrund steht". Die typischen Ethnologiestudenten beschreibt sie dennoch detailliert: „Sie tragen Naturfasern, weite Wickelhosen, lange bunte Röcke und Leinenblusen, sie schauen immer sehr naturverbunden aus."</p>
            
            <p>Und weiter: „Als Accessoires werden Tücher verschieden kombiniert und die Schmuckstücke sind aus Holz oder selbst gemacht. Sie kaufen in Secondhand-Shops, auf Flohmärkten oder in Fairtrade-Geschäften ein." Martina Rogy pauschalisiert munter weiter: Juristen tragen Anzug oder Kostüm, „manchmal kleiden sie sich aber auch legerer und sehen dann Wirtschaftswissenschaftsstudenten ähnlich. Zu ihren Outfits kombinieren sie teuren Schmuck und Taschen von Gucci oder Louis Vuitton."</p>
            
            <p><strong>Der Trick der Wahrsager</strong></p>
            
            <p>Dass nicht nur bei der Prüfung der erste Eindruck zählt, ist allgemein bekannt. Kleidung erlaubt uns, Menschen einzuordnen, wir schließen vom Outfit auf die Gesinnung. „Viele Menschen drücken eine gewisse Gruppenzugehörigkeit aus, sei es ihre Vorliebe für eine bestimmte Musikrichtung, ihre politische Gesinnung oder ihren beruflichen Wirkungsbereich", meint Rogy.</p>
            
            <p>„Auch wer sich nachlässig kleidet, sagt damit etwas aus", so Ruth Glaser. „Und zwar: 'Schaut her, ich lege keinen Wert auf die Meinung anderer.'"</p>
            
            <p>Es sei erstaunlich, wie sehr sich von der Kleidung auf die Persönlichkeit des Trägers schließen lässt: „Das ist wahrscheinlich der Trick der Wahrsager." Und weiter: „Je mehr man darauf achtet, desto mehr lernt man, Details zu erkennen. Bei einem Workshop in einer Bank ist es mir beispielsweise einmal gelungen, jedem Mitarbeiter das richtige Auto am Firmenparkplatz zuzuordnen."</p>
            
            <p><strong>Hauptsache glaubwürdig</strong></p>
            
            <p>Die Wirkung, die unsere Kleidung auf das Gegenüber hat, lässt sich natürlich auch bewusst nutzen. Rogy: „Man kann sich als jemand ausgeben, der man eigentlich gar nicht ist." Der Haken: „Nur wenn man sich nicht verkleidet, ist man auch selbstsicherer, besser gelaunt und auch imstande, bessere Leistungen zu erbringen". Es gilt also: Egal ob High Heels oder Converse, Chanel Nr. 5 oder Patchouli-Öl, wichtig ist allein, sich wohlzufühlen. Und: „Natürlich findet man auch in jeder Studienrichtung Leute, die anders aussehen und dem allgemeinen Trend nicht folgen", beruhigt Rogy. Dabei handelt es sich wohl endlich um die viel zitierte Individualität.</p>
        `
    }
};

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

// --- ÚJ: LESEVERSTEHEN AUFGABE 2 ADATOK ---
export const leseAufgabe2Headings = [
    { id: 'A', text: 'Nachwuchs weiterhin wichtiger als Top-Job' },
    { id: 'B', text: 'Schnell essen macht dick' },
    { id: 'C', text: 'Neue Broschüre: Studieren im Ausland' },
    { id: 'D', text: 'Was tun nach der Schule? Neue Ausbildungsmöglichkeiten' },
    { id: 'E', text: 'Initiative: Frauen für Männerberufe begeistern' },
    { id: 'F', text: 'Immer mehr Frauen machen Karriere im technischen Bereich' },
    { id: 'G', text: 'Experiment in Florida: Schlank in zwölf Stunden' },
    { id: 'H', text: 'Ernährungstipps kostenlos per Telefon' },
    { id: 'I', text: 'Schweizer Frauen kämpfen für mehr Rechte im Beruf' },
    { id: 'K', text: 'Wissenschafter warnen: Immer mehr dicke Mädchen in Österreich!' }
];

export const leseAufgabe2Texts = [
    { 
        id: 1, 
        text: "Ein hochwertiger Schulabschluss gilt gemeinhin als Schlüssel zum Berufsein- und -aufstieg. Das ist aber nur bedingt richtig, denn sonst hätten die Frauen auf dem Arbeitsmarkt längst die Nase vorn: Mehr als die Hälfte aller Absolventen an höheren Schulen ist weiblich. Trotz besserer Qualifikation haben Frauen aber das Nachsehen. Zu diesem Schluss kommt eine Untersuchung des städtischen Frauenreferats zur Ausbildungssituation von Mädchen und Frauen in Frankfurt. Eine Erklärung für die schlechte Lage von weiblichen Arbeitskräften ist die Tatsache, dass Frauen nach wie vor für Familie und Kindererziehung auf Karriere verzichten.", 
        correct: 'A' 
    },
    { 
        id: 2, 
        text: "Übergewicht könnte erblich durch Krankheiten, aber auch durch falsche Essgewohnheiten bedingt sein. Psychiater der Universität Florida haben jetzt das schnelle Essen als mögliche Ursache für Fettleibigkeit entdeckt. Die Wissenschaftler untersuchten, was genau im Hirn bei der Nahrungsaufnahme passiert. Zu diesem Zweck bekamen Testpersonen nach einer zwölfstündigen Fastenzeit eine Zuckerlösung zu trinken. Zuerst zeigte sich verstärkte Gehirntätigkeit, ausgelöst durch Schlucken, Geruch und Geschmack. Dann, zehn Minuten später, signalisierte das Gehirn, dass der Körper genug habe. Bei Menschen, die zu schnell essen, ist dieses Signal stark verzögert. Daher dürfte das Sprichwort „Iss langsam, Kind!“ tatsächlich eine Weisheit sein.", 
        correct: 'B' 
    },
    { 
        id: 3, 
        text: "Wenn Sie mehr über richtige Ernährung und das ideale Gewicht wissen wollen, informieren Sie der „Fonds Gesundes Österreich“ und der Verein für Konsumenteninformation darüber. Unter der Nummer 0810 / 810 27 werden gratis firmenunabhängige, wissenschaftlich fundierte Informationen über ausgewogene und gesunde Ernährung angeboten. Die Verantwortlichen reagieren damit auf den erschreckenden Trend, dass die Zahl der dicken Menschen, darunter vor allem Kinder, immer mehr zunimmt. In den vergangenen 15 Jahren habe sich die Zahl übergewichtiger Kinder und Jugendlicher mehr als verdoppelt. Bewegungsmangel und fettes Essen seien die Hauptgründe dafür.", 
        correct: 'H' 
    },
    { 
        id: 4, 
        text: "Das Arbeitsamt Berlin hat seine beiden Informationshefte „Alternativen zum Studium“ neu aufgelegt. Auf 200 Seiten zeigt die Behörde neue Ausbildungsmöglichkeiten für junge Frauen und Männer nach der Schule außerhalb der Universitäten. Ein Heft befasst sich mit betriebswirtschaftlichen Ausbildungen bzw. fremdsprachlichen Angeboten im sozialen Bereich, das andere mit dem technisch-naturwissenschaftlichen Bereich. Mit diesen Broschüren geht auch eine Informationswoche einher, die die hohe Zahl an Studienbewerbern in Deutschland reduzieren helfen und andere Wege einer guten Berufsausbildung für junge Leute aufzeigen soll.", 
        correct: 'D' 
    },
    { 
        id: 5, 
        text: "Junge Frauen in der Schweiz sollen nun mehr Chancen für eine offene Berufswahl haben. Mit einer Motivationskampagne wollen die Fachleute zum Umdenken anregen und neue Horizonte öffnen. „Von wem würden Sie lieber Ihr Auto reparieren lassen?“ oder „Wem vertrauen Sie eher eine Herzoperation an?“ heißt es unter jeweils zwei Porträts einer Frau und eines Mannes. Die Plakate sollen für den „kleinen Unterschied im Kopf“ sensibilisieren, wonach Frauen nicht dasselbe zugetraut wird wie Männern. Immer noch ergreifen junge Frauen typische Frauenberufe wie Textilverkäuferin oder Sekretärin. Mit einem Internetwettbewerb soll das Thema „Frauen und Technik“ fokussiert werden, im Speziellen der Informatiksektor, der in der Schweiz noch ganz in Männerhand ist.", 
        correct: 'E' 
    }
];