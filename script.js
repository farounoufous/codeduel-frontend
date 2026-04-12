// ===================================================
// CONNEXION AU SERVEUR
// ===================================================
const socket = io('https://codeduel-backend.onrender.com');

socket.on('connect', () => {
  console.log('✅ Connecté au serveur');
});

socket.on('disconnect', () => {
  console.log('🔴 Déconnecté du serveur');
});
// Partie terminée
socket.on('partie-terminee', (data) => {
  clearInterval(chrono);
  afficherEcran(ecranResultat);
  lancerConfettis();
  lancerConfettis();

  const gagnant = data.gagnant;
  const estGagnant = joueurInfo && gagnant.nom === joueurInfo.nom;

  resultatEl.innerHTML =
    '<div class="resultat-titre">' + (estGagnant ? '🏆 Tu as gagné !' : '🎮 Partie terminée !') + '</div>' +
    '<div class="resultat-score">' + (estGagnant ? '+ 5000 FCFA 🤑' : score + ' pts') + '</div>' +
    '<div class="resultat-message">' + (estGagnant ? 'Félicitations ! Tu es le meilleur !' : 'Gagnant : ' + gagnant.nom + ' avec ' + gagnant.score + ' pts') + '</div>';
});

// Salle réinitialisée
socket.on('salle-reinitialise', () => {
  score = 0;
  questionActuelle = 0;
  joueurInfo = null;
  afficherEcran(ecranAccueil);
});
// ===================================================
// BANQUE DE 150 QUESTIONS
// ===================================================
const banqueQuestions = [
  { texte: "Quel programme calcule la somme de 1 à 5 ?", choix: [
    "let s=0; for(let i=1;i<=5;i++) s+=i; console.log(s);",
    "let s=0; for(let i=0;i<5;i++) s+=i; console.log(s);",
    "let s=1; for(let i=1;i<=5;i++) s+=i; console.log(s);",
    "let s=0; for(let i=1;i<5;i++) s+=i; console.log(s);"
  ], bonne: 0, lang: "JS" },

  { texte: "Quel programme affiche les nombres pairs de 1 à 10 ?", choix: [
    "for(let i=1;i<=10;i++) { if(i%2===0) console.log(i); }",
    "for(let i=1;i<=10;i++) { if(i%2===1) console.log(i); }",
    "for(let i=0;i<=10;i++) { if(i%3===0) console.log(i); }",
    "for(let i=2;i<=10;i++) { if(i%2===0) console.log(i+1); }"
  ], bonne: 0, lang: "JS" },

  { texte: "Quel programme inverse un tableau ?", choix: [
    "let t=[1,2,3]; console.log(t.reverse());",
    "let t=[1,2,3]; console.log(t.sort());",
    "let t=[1,2,3]; console.log(t.slice());",
    "let t=[1,2,3]; console.log(t.splice(0));"
  ], bonne: 0, lang: "JS" },

  { texte: "Quel programme trouve le plus grand nombre d'un tableau ?", choix: [
    "let t=[3,1,4,1,5]; console.log(Math.max(...t));",
    "let t=[3,1,4,1,5]; console.log(Math.min(...t));",
    "let t=[3,1,4,1,5]; console.log(t.sort()[0]);",
    "let t=[3,1,4,1,5]; console.log(t.length);"
  ], bonne: 0, lang: "JS" },

  { texte: "Quel programme vérifie si un mot est un palindrome ?", choix: [
    "function f(s){return s===s.split('').reverse().join('');}",
    "function f(s){return s===s.split('').sort().join('');}",
    "function f(s){return s.length===s.reverse();}",
    "function f(s){return s[0]===s[s.length-1];}"
  ], bonne: 0, lang: "JS" },

  { texte: "Quel programme compte le nombre de voyelles dans une chaîne ?", choix: [
    "function f(s){return s.split('').filter(c=>'aeiou'.includes(c)).length;}",
    "function f(s){return s.split('').filter(c=>'aeiou'.includes(c)).join('');}",
    "function f(s){return s.length - s.split('').filter(c=>'aeiou'.includes(c)).length;}",
    "function f(s){return s.split('aeiou').length;}"
  ], bonne: 0, lang: "JS" },

  { texte: "Quel programme calcule la factorielle de n ?", choix: [
    "function f(n){let r=1; for(let i=1;i<=n;i++) r*=i; return r;}",
    "function f(n){let r=0; for(let i=1;i<=n;i++) r+=i; return r;}",
    "function f(n){let r=1; for(let i=0;i<=n;i++) r*=i; return r;}",
    "function f(n){let r=1; for(let i=1;i<n;i++) r*=i; return r;}"
  ], bonne: 0, lang: "JS" },

  { texte: "Quel programme supprime les doublons d'un tableau ?", choix: [
    "let t=[1,1,2,3,3]; console.log([...new Set(t)]);",
    "let t=[1,1,2,3,3]; console.log(t.filter(x=>x>1));",
    "let t=[1,1,2,3,3]; console.log(t.sort());",
    "let t=[1,1,2,3,3]; console.log(t.slice(1));"
  ], bonne: 0, lang: "JS" },

  { texte: "Quel programme génère un nombre aléatoire entre 1 et 100 ?", choix: [
    "console.log(Math.floor(Math.random()*100)+1);",
    "console.log(Math.random()*100);",
    "console.log(Math.ceil(Math.random()*100)+1);",
    "console.log(Math.round(Math.random()+100));"
  ], bonne: 0, lang: "JS" },

  { texte: "Quel programme convertit des degrés Celsius en Fahrenheit ?", choix: [
    "function f(c){return c*9/5+32;}",
    "function f(c){return c*5/9+32;}",
    "function f(c){return c*9/5-32;}",
    "function f(c){return (c+32)*9/5;}"
  ], bonne: 0, lang: "JS" },

  // PYTHON
  { texte: "Quel programme Python affiche la table de multiplication de 3 ?", choix: [
    "for i in range(1,11):\n    print(3*i)",
    "for i in range(1,11):\n    print(3+i)",
    "for i in range(0,10):\n    print(3*i)",
    "for i in range(1,10):\n    print(3*i)"
  ], bonne: 0, lang: "PY" },

  { texte: "Quel programme Python calcule la moyenne d'une liste ?", choix: [
    "lst=[10,20,30]\nprint(sum(lst)/len(lst))",
    "lst=[10,20,30]\nprint(sum(lst)*len(lst))",
    "lst=[10,20,30]\nprint(sum(lst)-len(lst))",
    "lst=[10,20,30]\nprint(max(lst)/len(lst))"
  ], bonne: 0, lang: "PY" },

  { texte: "Quel programme Python vérifie si un nombre est premier ?", choix: [
    "def est_premier(n):\n    if n<2: return False\n    for i in range(2,n):\n        if n%i==0: return False\n    return True",
    "def est_premier(n):\n    for i in range(2,n):\n        if n%i==0: return True\n    return False",
    "def est_premier(n):\n    return n%2==0",
    "def est_premier(n):\n    return n>2"
  ], bonne: 0, lang: "PY" },

  { texte: "Quel programme Python trie une liste dans l'ordre décroissant ?", choix: [
    "lst=[3,1,4,2]\nlst.sort(reverse=True)\nprint(lst)",
    "lst=[3,1,4,2]\nlst.sort()\nprint(lst)",
    "lst=[3,1,4,2]\nprint(sorted(lst))",
    "lst=[3,1,4,2]\nlst.reverse()\nprint(lst)"
  ], bonne: 0, lang: "PY" },

  { texte: "Quel programme Python compte les mots dans une phrase ?", choix: [
    "phrase='Bonjour le monde'\nprint(len(phrase.split()))",
    "phrase='Bonjour le monde'\nprint(len(phrase))",
    "phrase='Bonjour le monde'\nprint(phrase.count(' '))",
    "phrase='Bonjour le monde'\nprint(len(phrase.split('')))"
  ], bonne: 0, lang: "PY" },

  { texte: "Quel programme Python crée un dictionnaire à partir de deux listes ?", choix: [
    "cles=['a','b','c']\nvals=[1,2,3]\nd=dict(zip(cles,vals))\nprint(d)",
    "cles=['a','b','c']\nvals=[1,2,3]\nd=dict(cles,vals)\nprint(d)",
    "cles=['a','b','c']\nvals=[1,2,3]\nd={cles:vals}\nprint(d)",
    "cles=['a','b','c']\nvals=[1,2,3]\nd=list(zip(cles,vals))\nprint(d)"
  ], bonne: 0, lang: "PY" },

  { texte: "Quel programme Python affiche le carré des nombres de 1 à 5 ?", choix: [
    "for i in range(1,6):\n    print(i**2)",
    "for i in range(1,6):\n    print(i*2)",
    "for i in range(1,5):\n    print(i**2)",
    "for i in range(0,5):\n    print(i**2)"
  ], bonne: 0, lang: "PY" },

  { texte: "Quel programme Python lit un fichier et affiche son contenu ?", choix: [
    "with open('f.txt','r') as f:\n    print(f.read())",
    "with open('f.txt','w') as f:\n    print(f.read())",
    "f=open('f.txt')\nf.write()\nprint(f)",
    "open('f.txt').display()"
  ], bonne: 0, lang: "PY" },

  { texte: "Quel programme Python trouve le minimum d'une liste ?", choix: [
    "lst=[5,3,8,1,9]\nprint(min(lst))",
    "lst=[5,3,8,1,9]\nprint(max(lst))",
    "lst=[5,3,8,1,9]\nprint(lst[0])",
    "lst=[5,3,8,1,9]\nprint(sum(lst))"
  ], bonne: 0, lang: "PY" },

  { texte: "Quel programme Python inverse une chaîne de caractères ?", choix: [
    "s='Bonjour'\nprint(s[::-1])",
    "s='Bonjour'\nprint(s.reverse())",
    "s='Bonjour'\nprint(s.split()[::-1])",
    "s='Bonjour'\nprint(reversed(s))"
  ], bonne: 0, lang: "PY" },

  // JAVA
  { texte: "Quel programme Java affiche les nombres de 1 à 5 ?", choix: [
    "for(int i=1;i<=5;i++){\n    System.out.println(i);\n}",
    "for(int i=0;i<5;i++){\n    System.out.println(i);\n}",
    "for(int i=1;i<5;i++){\n    System.out.println(i);\n}",
    "for(int i=1;i<=5;i++){\n    System.out.print(i);\n}"
  ], bonne: 0, lang: "JAVA" },

  { texte: "Quel programme Java vérifie si un nombre est négatif ?", choix: [
    "int n=-5;\nif(n<0) System.out.println(\"Négatif\");",
    "int n=-5;\nif(n>0) System.out.println(\"Négatif\");",
    "int n=-5;\nif(n==0) System.out.println(\"Négatif\");",
    "int n=-5;\nif(n<=0) System.out.println(\"Positif\");"
  ], bonne: 0, lang: "JAVA" },

  { texte: "Quel programme Java calcule la puissance de 2 exposant 8 ?", choix: [
    "System.out.println((int)Math.pow(2,8));",
    "System.out.println(Math.sqrt(2,8));",
    "System.out.println(2*8);",
    "System.out.println(Math.abs(2,8));"
  ], bonne: 0, lang: "JAVA" },

  { texte: "Quel programme Java convertit une chaîne en majuscules ?", choix: [
    "String s=\"bonjour\";\nSystem.out.println(s.toUpperCase());",
    "String s=\"bonjour\";\nSystem.out.println(s.toLowerCase());",
    "String s=\"bonjour\";\nSystem.out.println(s.charAt(0));",
    "String s=\"bonjour\";\nSystem.out.println(s.length());"
  ], bonne: 0, lang: "JAVA" },

  { texte: "Quel programme Java vérifie si une chaîne est vide ?", choix: [
    "String s=\"\";\nSystem.out.println(s.isEmpty());",
    "String s=\"\";\nSystem.out.println(s.isNull());",
    "String s=\"\";\nSystem.out.println(s==null);",
    "String s=\"\";\nSystem.out.println(s.length>0);"
  ], bonne: 0, lang: "JAVA" },

  // C
  { texte: "Quel programme C calcule la somme de deux entiers ?", choix: [
    "int a=3,b=4;\nprintf(\"%d\",a+b);",
    "int a=3,b=4;\nprintf(\"%d\",a-b);",
    "int a=3,b=4;\nprintf(\"%d\",a*b);",
    "int a=3,b=4;\nprintf(\"%f\",a+b);"
  ], bonne: 0, lang: "C" },

  { texte: "Quel programme C affiche les nombres de 1 à 10 ?", choix: [
    "for(int i=1;i<=10;i++)\n    printf(\"%d\\n\",i);",
    "for(int i=0;i<10;i++)\n    printf(\"%d\\n\",i);",
    "for(int i=1;i<10;i++)\n    printf(\"%d\\n\",i);",
    "for(int i=1;i<=10;i++)\n    printf(\"%d\",i+1);"
  ], bonne: 0, lang: "C" },

  { texte: "Quel programme C vérifie si un entier est positif ?", choix: [
    "int n=5;\nif(n>0) printf(\"Positif\");",
    "int n=5;\nif(n<0) printf(\"Positif\");",
    "int n=5;\nif(n==0) printf(\"Positif\");",
    "int n=5;\nif(n>=0) printf(\"Négatif\");"
  ], bonne: 0, lang: "C" },

  { texte: "Quel programme C calcule l'aire d'un cercle de rayon 5 ?", choix: [
    "float r=5;\nprintf(\"%f\",3.14*r*r);",
    "float r=5;\nprintf(\"%f\",2*3.14*r);",
    "float r=5;\nprintf(\"%f\",3.14*r);",
    "float r=5;\nprintf(\"%f\",r*r);"
  ], bonne: 0, lang: "C" },

  { texte: "Quel programme C échange les valeurs de deux variables ?", choix: [
    "int a=1,b=2,tmp;\ntmp=a; a=b; b=tmp;\nprintf(\"%d %d\",a,b);",
    "int a=1,b=2;\na=b; b=a;\nprintf(\"%d %d\",a,b);",
    "int a=1,b=2;\nint c=a+b;\nprintf(\"%d %d\",c,a);",
    "int a=1,b=2;\nprintf(\"%d %d\",b,b);"
  ], bonne: 0, lang: "C" },

  // PHP
  { texte: "Quel programme PHP affiche les éléments d'un tableau ?", choix: [
    "$t=[1,2,3];\nforeach($t as $v) echo $v.' ';",
    "$t=[1,2,3];\nfor($t as $v) echo $v.' ';",
    "$t=[1,2,3];\nwhile($t as $v) echo $v.' ';",
    "$t=[1,2,3];\neach($t as $v) echo $v.' ';"
  ], bonne: 0, lang: "PHP" },

  { texte: "Quel programme PHP calcule le carré d'un nombre ?", choix: [
    "$n=4;\necho pow($n,2);",
    "$n=4;\necho sqrt($n);",
    "$n=4;\necho $n*2;",
    "$n=4;\necho abs($n);"
  ], bonne: 0, lang: "PHP" },

  { texte: "Quel programme PHP vérifie si un nombre est pair ?", choix: [
    "$n=6;\nif($n%2==0) echo 'Pair';",
    "$n=6;\nif($n%2==1) echo 'Pair';",
    "$n=6;\nif($n/2==0) echo 'Pair';",
    "$n=6;\nif($n%3==0) echo 'Pair';"
  ], bonne: 0, lang: "PHP" },

  { texte: "Quel programme PHP compte les éléments d'un tableau ?", choix: [
    "$t=['a','b','c'];\necho count($t);",
    "$t=['a','b','c'];\necho length($t);",
    "$t=['a','b','c'];\necho sizeof($t)+1;",
    "$t=['a','b','c'];\necho $t->count();"
  ], bonne: 0, lang: "PHP" },

  { texte: "Quel programme PHP affiche la date du jour ?", choix: [
    "echo date('d/m/Y');",
    "echo time('d/m/Y');",
    "echo now('d/m/Y');",
    "echo Date::today();"
  ], bonne: 0, lang: "PHP" },

  // HTML/CSS
  { texte: "Quel code HTML crée un bouton rouge avec le texte 'Jouer' ?", choix: [
    "<button style=\"background:red\">Jouer</button>",
    "<btn style=\"color:red\">Jouer</btn>",
    "<button color=\"red\">Jouer</button>",
    "<input type=\"red\" value=\"Jouer\">"
  ], bonne: 0, lang: "HTML" },

  { texte: "Quel code CSS centre un div horizontalement avec flexbox ?", choix: [
    ".box{display:flex; justify-content:center;}",
    ".box{display:flex; align-content:center;}",
    ".box{display:block; justify-content:center;}",
    ".box{display:flex; text-align:center;}"
  ], bonne: 0, lang: "CSS" },

  { texte: "Quel code HTML crée une liste avec 3 éléments ?", choix: [
    "<ul><li>Un</li><li>Deux</li><li>Trois</li></ul>",
    "<ol><p>Un</p><p>Deux</p><p>Trois</p></ol>",
    "<list><item>Un</item><item>Deux</item></list>",
    "<ul><p>Un</p><p>Deux</p><p>Trois</p></ul>"
  ], bonne: 0, lang: "HTML" },

  { texte: "Quel code CSS donne une largeur de 50% à un élément ?", choix: [
    ".box{width:50%;}",
    ".box{size:50%;}",
    ".box{length:50%;}",
    ".box{dimension:50%;}"
  ], bonne: 0, lang: "CSS" },

  { texte: "Quel code HTML crée un champ de mot de passe ?", choix: [
    "<input type=\"password\" name=\"mdp\">",
    "<input type=\"secret\" name=\"mdp\">",
    "<input type=\"hidden\" name=\"mdp\">",
    "<password name=\"mdp\">"
  ], bonne: 0, lang: "HTML" },

  { texte: "Quel code CSS rend un texte en italique ?", choix: [
    "p{font-style:italic;}",
    "p{text-style:italic;}",
    "p{font-weight:italic;}",
    "p{style:italic;}"
  ], bonne: 0, lang: "CSS" },

  { texte: "Quel code HTML insère un saut de ligne ?", choix: [
    "<br>",
    "<lb>",
    "<newline>",
    "<nl>"
  ], bonne: 0, lang: "HTML" },

  { texte: "Quel code CSS ajoute une bordure noire de 1px ?", choix: [
    ".box{border:1px solid black;}",
    ".box{border:1px black;}",
    ".box{outline:1px solid black;}",
    ".box{border-size:1px black;}"
  ], bonne: 0, lang: "CSS" },

  { texte: "Quel code HTML crée une case à cocher ?", choix: [
    "<input type=\"checkbox\" name=\"ok\">",
    "<input type=\"check\" name=\"ok\">",
    "<checkbox name=\"ok\">",
    "<input type=\"radio\" name=\"ok\">"
  ], bonne: 0, lang: "HTML" },

  { texte: "Quel code CSS change la police en Arial ?", choix: [
    "body{font-family:Arial;}",
    "body{font:Arial;}",
    "body{text-font:Arial;}",
    "body{typeface:Arial;}"
  ], bonne: 0, lang: "CSS" },
  { texte: "Complète : function additionner(a, b) { return ___ ; }", choix: ["a + b", "a - b", "a * b", "a / b"], bonne: 0, lang: "JS" },
  { texte: "Complète pour afficher 'Bonjour' 3 fois :\nfor (let i = 0; i < ___; i++) { console.log('Bonjour'); }", choix: ["3", "2", "4", "1"], bonne: 0, lang: "JS" },
  { texte: "Complète pour calculer le carré d'un nombre :\nfunction carre(n) { return ___; }", choix: ["n * n", "n + n", "n ^ 2", "n ** n"], bonne: 0, lang: "JS" },
  { texte: "Complète pour vérifier si un nombre est pair :\nfunction estPair(n) { return n % ___ === 0; }", choix: ["2", "1", "0", "3"], bonne: 0, lang: "JS" },
  { texte: "Complète pour calculer l'âge :\nfunction calculerAge(anneeNaissance) { return ___ - anneeNaissance; }", choix: ["new Date().getFullYear()", "Date.now()", "new Date()", "Date.getYear()"], bonne: 0, lang: "JS" },
  { texte: "Complète pour trouver le maximum entre deux nombres :\nfunction max(a, b) { return a > b ? ___ : b; }", choix: ["a", "b", "a + b", "a - b"], bonne: 0, lang: "JS" },
  { texte: "Complète pour inverser une chaîne :\nfunction inverser(s) { return s.___().reverse().join(''); }", choix: ["split('')", "split(' ')", "slice()", "splice()"], bonne: 0, lang: "JS" },
  { texte: "Complète pour compter les éléments d'un tableau :\nconst fruits = ['pomme','mangue','ananas'];\nconsole.log(fruits.___);", choix: ["length", "count", "size", "total"], bonne: 0, lang: "JS" },
  { texte: "Complète pour ajouter un élément à la fin d'un tableau :\nlet tab = [1, 2, 3];\ntab.___(4);", choix: ["push", "add", "append", "insert"], bonne: 0, lang: "JS" },
  { texte: "Complète pour convertir une chaîne en nombre :\nlet age = ___('25');", choix: ["parseInt", "toNumber", "convert", "Number.parse"], bonne: 0, lang: "JS" },
  { texte: "Complète pour créer une fonction fléchée qui double un nombre :\nconst doubler = ___ => n * 2;", choix: ["n", "(n, m)", "function n", "var n"], bonne: 0, lang: "JS" },
  { texte: "Complète pour parcourir un tableau :\n[1,2,3].forEach(___ => console.log(el));", choix: ["el", "function", "item =>", "each"], bonne: 0, lang: "JS" },
  { texte: "Complète pour filtrer les nombres pairs :\n[1,2,3,4].filter(n => n % 2 === ___);", choix: ["0", "1", "2", "n"], bonne: 0, lang: "JS" },
  { texte: "Complète pour créer un objet personne :\nconst personne = { nom: 'Alice', ___: 25 };", choix: ["age", "Age", "AGE", "années"], bonne: 0, lang: "JS" },
  { texte: "Quel mot-clé déclare une constante en JS ?", choix: ["const", "let", "var", "fixed"], bonne: 0, lang: "JS" },
  { texte: "Complète pour afficher la longueur d'une chaîne :\nlet mot = 'CodeDuel';\nconsole.log(mot.___);", choix: ["length", "size", "count", "len"], bonne: 0, lang: "JS" },
  { texte: "Complète pour transformer en majuscules :\nlet s = 'bonjour';\nconsole.log(s.___());", choix: ["toUpperCase", "toUpper", "uppercase", "upper"], bonne: 0, lang: "JS" },
  { texte: "Complète pour vérifier si une chaîne contient 'code' :\nlet s = 'je code';\nconsole.log(s.___('code'));", choix: ["includes", "contains", "has", "find"], bonne: 0, lang: "JS" },
  { texte: "Complète pour arrondir un nombre :\nconsole.log(Math.___( 4.7 ));", choix: ["round", "floor", "ceil", "trunc"], bonne: 0, lang: "JS" },
  { texte: "Complète pour générer un nombre aléatoire entre 0 et 1 :\nconsole.log(Math.___());", choix: ["random", "rand", "random(0,1)", "getRandom"], bonne: 0, lang: "JS" },
  { texte: "Complète pour afficher 'Bonjour' en Python :\n___(\"Bonjour le monde\")", choix: ["print", "echo", "console.log", "System.out.println"], bonne: 0, lang: "PY" },
  { texte: "Complète pour vérifier si un nombre est pair en Python :\ndef est_pair(n):\n    return n % ___ == 0", choix: ["2", "1", "0", "3"], bonne: 0, lang: "PY" },
  { texte: "Complète la boucle pour afficher 0 à 4 :\nfor i in ___(5):\n    print(i)", choix: ["range", "loop", "list", "each"], bonne: 0, lang: "PY" },
  { texte: "Complète pour calculer la somme d'une liste :\nnombres = [1, 2, 3, 4, 5]\ntotal = ___(nombres)", choix: ["sum", "total", "add", "count"], bonne: 0, lang: "PY" },
  { texte: "Complète pour trouver la longueur d'une liste Python :\nfruits = ['mangue', 'ananas']\nn = ___(fruits)", choix: ["len", "length", "count", "size"], bonne: 0, lang: "PY" },
  { texte: "Complète pour ajouter un élément à une liste Python :\nma_liste = [1, 2]\nma_liste.___( 3 )", choix: ["append", "add", "push", "insert"], bonne: 0, lang: "PY" },
  { texte: "Complète pour créer une fonction en Python :\n___ addition(a, b):\n    return a + b", choix: ["def", "function", "func", "fn"], bonne: 0, lang: "PY" },
  { texte: "Complète pour lire une entrée utilisateur en Python :\nnom = ___(\"Ton nom : \")", choix: ["input", "read", "scan", "get"], bonne: 0, lang: "PY" },
  { texte: "Complète pour convertir en entier en Python :\nn = ___( '42' )", choix: ["int", "integer", "toInt", "Number"], bonne: 0, lang: "PY" },
  { texte: "Complète pour créer une classe en Python :\n___ Voiture:\n    def __init__(self, marque):\n        self.marque = marque", choix: ["class", "object", "struct", "type"], bonne: 0, lang: "PY" },
  { texte: "Complète pour créer un lien cliquable en HTML :\nJouer", choix: ["href", "src", "link", "url"], bonne: 0, lang: "HTML" },
  { texte: "Complète pour afficher une image en HTML :\n", choix: ["src", "href", "link", "url"], bonne: 0, lang: "HTML" },
  { texte: "Complète pour centrer du texte en CSS :\np { text-___: center; }", choix: ["align", "center", "position", "justify"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour mettre une couleur de fond CSS :\nbody { ___-color: #0F0A1E; }", choix: ["background", "bg", "back", "color"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour changer la taille du texte CSS :\nh1 { font-___: 32px; }", choix: ["size", "weight", "style", "height"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour aligner des éléments avec flexbox :\n.container { display: ___; }", choix: ["flex", "grid", "block", "inline"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour afficher 'Bonjour' en Java :\nSystem.out.___(\"Bonjour\");", choix: ["println", "print", "log", "write"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour déclarer un entier en Java :\n___ age = 25;", choix: ["int", "Integer", "number", "var"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour créer une méthode qui retourne la somme en Java :\npublic ___ addition(int a, int b) { return a + b; }", choix: ["int", "void", "String", "double"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour créer une boucle for de 0 à 4 en Java :\nfor (int i = 0; i < 5; ___) { }", choix: ["i++", "i--", "i+1", "i+=2"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour déclarer une chaîne en Java :\n___ nom = \"Alice\";", choix: ["String", "string", "str", "char"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour afficher 'Bonjour' en C :\n___(\"Bonjour\\n\");", choix: ["printf", "print", "cout", "echo"], bonne: 0, lang: "C" },
  { texte: "Complète pour lire un entier en C :\nint age;\n___(\" %d\", &age);", choix: ["scanf", "read", "input", "cin"], bonne: 0, lang: "C" },
  { texte: "Complète pour déclarer une fonction en C :\n___ addition(int a, int b) { return a + b; }", choix: ["int", "void", "func", "def"], bonne: 0, lang: "C" },
  { texte: "Complète pour inclure la bibliothèque standard en C :\n___", choix: ["#include", "#import", "#require", "#use"], bonne: 0, lang: "C" },
  { texte: "Complète la fonction principale en C :\n___ main() { return 0; }", choix: ["int", "void", "main", "func"], bonne: 0, lang: "C" },
  { texte: "Complète pour afficher du texte en PHP :\n___(\"Bonjour le monde\");", choix: ["echo", "print", "console.log", "printf"], bonne: 0, lang: "PHP" },
  { texte: "Complète pour déclarer une variable en PHP :\n___nom = \"Alice\";", choix: ["$", "&", "#", "@"], bonne: 0, lang: "PHP" },
  { texte: "Complète pour créer une fonction en PHP :\n___ addition($a, $b) { return $a + $b; }", choix: ["function", "def", "func", "method"], bonne: 0, lang: "PHP" },
  { texte: "Complète pour parcourir un tableau en PHP :\n___ ($fruits as $fruit) { echo $fruit; }", choix: ["foreach", "for", "while", "each"], bonne: 0, lang: "PHP" },
  { texte: "Que signifie HTML ?", choix: ["HyperText Markup Language", "High Text Machine Language", "HyperText Making Language", "Hyper Tool Markup Language"], bonne: 0, lang: "CULTURE" },
  { texte: "Que signifie CSS ?", choix: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Colorful Style Sheets"], bonne: 0, lang: "CULTURE" },
  { texte: "Que signifie API ?", choix: ["Application Programming Interface", "Advanced Program Integration", "Application Process Interface", "Automated Programming Interface"], bonne: 0, lang: "CULTURE" },
  { texte: "Quel protocole est utilisé pour les sites web sécurisés ?", choix: ["HTTPS", "HTTP", "FTP", "SSH"], bonne: 0, lang: "CULTURE" },
  { texte: "Que fait la méthode GET en HTTP ?", choix: ["Récupère des données du serveur", "Envoie des données au serveur", "Supprime des données", "Met à jour des données"], bonne: 0, lang: "CULTURE" },
  { texte: "Complète pour trier une liste Python :\nnombres = [3, 1, 2]\nnombres.___( )", choix: ["sort", "order", "rank", "arrange"], bonne: 0, lang: "PY" },
  { texte: "Complète pour vérifier si un élément est dans une liste Python :\nif 'mangue' ___ fruits:", choix: ["in", "is", "==", "contains"], bonne: 0, lang: "PY" },
  { texte: "Complète pour gérer une erreur en Python :\ntry:\n    x = 1/0\n___:\n    print('Erreur')", choix: ["except", "catch", "error", "fail"], bonne: 0, lang: "PY" },
  { texte: "Complète pour générer un nombre aléatoire en Python :\nimport random\nprint(random.___(1, 100))", choix: ["randint", "random", "rand", "choice"], bonne: 0, lang: "PY" },
  { texte: "Complète pour joindre une liste en chaîne Python :\nmots = ['Bonjour', 'monde']\nphrase = ' '.___( mots )", choix: ["join", "concat", "merge", "combine"], bonne: 0, lang: "PY" },
  { texte: "Complète pour arrondir les coins d'un bouton CSS :\n.btn { border-___: 50px; }", choix: ["radius", "round", "curve", "corner"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour cacher un élément CSS :\n.cache { display: ___; }", choix: ["none", "hidden", "invisible", "hide"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour mettre du texte en gras CSS :\n.titre { font-___: bold; }", choix: ["weight", "style", "size", "bold"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour sélectionner par classe en CSS :\n___nom-classe { color: red; }", choix: [".", "#", "@", "&"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour créer une animation CSS :\n@___ monAnimation { from { opacity:0; } to { opacity:1; } }", choix: ["keyframes", "animation", "frames", "transition"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour hériter d'une classe en Java :\npublic class Voiture ___ Vehicule { }", choix: ["extends", "implements", "inherits", "from"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour convertir String en int en Java :\nint n = Integer.___(\"42\");", choix: ["parseInt", "toInt", "convert", "valueOf"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour créer une ArrayList en Java :\nArrayList liste = new ___<>();", choix: ["ArrayList", "List", "Array", "LinkedList"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour ajouter à une ArrayList en Java :\nliste.___(\"Cotonou\");", choix: ["add", "push", "append", "insert"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour déclarer un tableau de 5 entiers en C :\nint nombres[___];", choix: ["5", "4", "6", "0"], bonne: 0, lang: "C" },
  { texte: "Complète pour allouer de la mémoire en C :\nint* p = ___(sizeof(int));", choix: ["malloc", "alloc", "new", "create"], bonne: 0, lang: "C" },
  { texte: "Complète pour libérer la mémoire en C :\n___(p);", choix: ["free", "delete", "release", "clear"], bonne: 0, lang: "C" },
  { texte: "Complète pour la longueur d'une chaîne en C :\nint n = ___(\"Bonjour\");", choix: ["strlen", "length", "size", "count"], bonne: 0, lang: "C" },
  { texte: "Complète pour comparer deux chaînes en C :\nif (___(s1, s2) == 0) { }", choix: ["strcmp", "compare", "equals", "strcomp"], bonne: 0, lang: "C" },
  { texte: "Complète pour la longueur d'un tableau PHP :\n$n = ___($ fruits);", choix: ["count", "length", "size", "sizeof"], bonne: 0, lang: "PHP" },
  { texte: "Complète pour concaténer des chaînes en PHP :\n$s = 'Bonjour' ___ ' monde';", choix: [".", "+", "&", ","], bonne: 0, lang: "PHP" },
  { texte: "Complète pour mettre en majuscules en PHP :\n$s = ___(\"bonjour\");", choix: ["strtoupper", "toUpper", "upper", "uppercase"], bonne: 0, lang: "PHP" },
  { texte: "Complète pour démarrer une session PHP :\n___();", choix: ["session_start", "start_session", "session()", "beginSession"], bonne: 0, lang: "PHP" },
  { texte: "Qu'est-ce qu'un bug ?", choix: ["Une erreur dans un programme", "Un virus informatique", "Une fonctionnalité cachée", "Un langage de programmation"], bonne: 0, lang: "CULTURE" },
  { texte: "Que fait la méthode POST en HTTP ?", choix: ["Envoie des données au serveur", "Récupère des données", "Supprime des données", "Liste des fichiers"], bonne: 0, lang: "CULTURE" },
  { texte: "Qu'est-ce qu'une base de données ?", choix: ["Un système pour stocker des données organisées", "Un langage de programmation", "Un navigateur web", "Un serveur web"], bonne: 0, lang: "CULTURE" },
  { texte: "Que signifie SQL ?", choix: ["Structured Query Language", "Simple Query Language", "Server Query Language", "Standard Query Logic"], bonne: 0, lang: "CULTURE" },
  { texte: "Qu'est-ce que le responsive design ?", choix: ["Un design qui s'adapte à tous les écrans", "Un design animé", "Un design en 3D", "Un design uniquement pour mobile"], bonne: 0, lang: "CULTURE" },
  { texte: "Complète pour mapper un tableau JS :\n[1,2,3].___(n => n * 2);", choix: ["map", "forEach", "filter", "reduce"], bonne: 0, lang: "JS" },
  { texte: "Complète pour supprimer les espaces d'une chaîne JS :\nlet s = '  bonjour  ';\nconsole.log(s.___());", choix: ["trim", "strip", "clean", "remove"], bonne: 0, lang: "JS" },
  { texte: "Complète pour fusionner deux tableaux JS :\nlet a = [1,2]; let b = [3,4];\nlet c = a.___(b);", choix: ["concat", "merge", "join", "push"], bonne: 0, lang: "JS" },
  { texte: "Complète pour convertir un objet en JSON :\nconst json = JSON.___(data);", choix: ["stringify", "parse", "encode", "toJSON"], bonne: 0, lang: "JS" },
  { texte: "Complète pour lire un JSON en JS :\nconst obj = JSON.___( '{\"nom\":\"Ali\"}' );", choix: ["parse", "stringify", "read", "decode"], bonne: 0, lang: "JS" },
  { texte: "Complète pour attendre 2 secondes en JS :\nsetTimeout(() => console.log('ok'), ___);", choix: ["2000", "2", "200", "20"], bonne: 0, lang: "JS" },
  { texte: "Complète pour trier un tableau croissant en JS :\n[3,1,2].sort((a,b) => ___ - ___);", choix: ["a, b", "b, a", "1, -1", "0, 1"], bonne: 0, lang: "JS" },
  { texte: "Complète pour créer une boucle while en JS :\nlet i = 0;\nwhile (i ___ 5) { i++; }", choix: ["<", ">", "=", ">="], bonne: 0, lang: "JS" },
  { texte: "Complète pour ouvrir un fichier en lecture en Python :\nf = open('data.txt', ___)", choix: ["'r'", "'w'", "'a'", "'x'"], bonne: 0, lang: "PY" },
  { texte: "Complète pour écrire dans un fichier Python :\nf = open('data.txt', 'w')\nf.___('Bonjour')", choix: ["write", "print", "add", "insert"], bonne: 0, lang: "PY" },
  { texte: "Complète pour importer un module Python :\n___ math", choix: ["import", "include", "require", "use"], bonne: 0, lang: "PY" },
  { texte: "Complète pour créer une liste de 1 à 5 en Python :\nma_liste = list(range(1, ___))", choix: ["6", "5", "4", "7"], bonne: 0, lang: "PY" },
  { texte: "Complète pour supprimer un élément d'une liste Python :\nma_liste.___(2)", choix: ["remove", "delete", "pop", "erase"], bonne: 0, lang: "PY" },
  { texte: "Complète pour écrire une liste en compréhension Python :\ncarres = [x**2 for x in ___(5)]", choix: ["range", "list", "loop", "each"], bonne: 0, lang: "PY" },
  { texte: "Complète pour convertir une liste en ensemble Python :\nuniques = ___(ma_liste)", choix: ["set", "unique", "distinct", "list"], bonne: 0, lang: "PY" },
  { texte: "Complète pour créer un tableau HTML :\n<___>\n  Données\n", choix: ["table", "grid", "list", "tab"], bonne: 0, lang: "HTML" },
  { texte: "Complète pour lier un fichier CSS à HTML :\n", choix: ["href", "src", "link", "url"], bonne: 0, lang: "HTML" },
  { texte: "Complète pour créer un formulaire HTML :\n<___ action=\"/envoyer\" method=\"post\">", choix: ["form", "input", "submit", "data"], bonne: 0, lang: "HTML" },
  { texte: "Complète pour intégrer du JavaScript dans HTML :\n<___ src=\"script.js\">", choix: ["script", "js", "code", "javascript"], bonne: 0, lang: "HTML" },
  { texte: "Complète pour définir une variable CSS :\n:root { ___couleur-principale: #7C3AED; }", choix: ["--", "var-", "$$", "@@"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour mettre une marge extérieure CSS :\n.carte { ___: 20px; }", choix: ["margin", "padding", "border", "space"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour sélectionner par id en CSS :\n___mon-id { color: blue; }", choix: ["#", ".", "@", "*"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour centrer verticalement avec flex CSS :\n.container { align-___: center; }", choix: ["items", "content", "self", "center"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour ajouter espace entre éléments flex CSS :\n.container { justify-content: ___; }", choix: ["space-between", "center", "flex-start", "space"], bonne: 0, lang: "CSS" },
  { texte: "Complète pour déclarer un flottant en C :\n___ prix = 9.99;", choix: ["float", "double", "int", "decimal"], bonne: 0, lang: "C" },
  { texte: "Complète pour afficher un entier en C :\nprintf(\"%___\", age);", choix: ["d", "s", "f", "c"], bonne: 0, lang: "C" },
  { texte: "Complète pour déclarer un pointeur en C :\nint ___ p = &x;", choix: ["*", "&", "->", "**"], bonne: 0, lang: "C" },
  { texte: "Complète pour copier une chaîne en C :\n___(dest, src);", choix: ["strcpy", "copy", "strdup", "memcpy"], bonne: 0, lang: "C" },
  { texte: "Complète pour concaténer deux chaînes en C :\n___(s1, s2);", choix: ["strcat", "concat", "append", "join"], bonne: 0, lang: "C" },
  { texte: "Complète pour vérifier si une variable existe en PHP :\nif (___($ nom)) { echo $nom; }", choix: ["isset", "exists", "defined", "has"], bonne: 0, lang: "PHP" },
  { texte: "Complète pour convertir en entier en PHP :\n$n = ___(\"42\");", choix: ["intval", "parseInt", "int", "toInt"], bonne: 0, lang: "PHP" },
  { texte: "Complète pour remplacer dans une chaîne PHP :\n$s = ___(\"monde\", \"Bénin\", \"Bonjour monde\");", choix: ["str_replace", "replace", "strreplace", "swap"], bonne: 0, lang: "PHP" },
  { texte: "Complète pour inclure un fichier PHP :\n___ 'header.php';", choix: ["include", "import", "require", "use"], bonne: 0, lang: "PHP" },
  { texte: "Complète pour rediriger en PHP :\n___(\"Location: accueil.php\");", choix: ["header", "redirect", "location", "goto"], bonne: 0, lang: "PHP" },
  { texte: "Complète pour créer un champ texte HTML :\n", choix: ["type", "kind", "format", "mode"], bonne: 0, lang: "HTML" },
  { texte: "Complète pour créer un titre de niveau 2 HTML :\n<___ >Bienvenue", choix: ["h2", "h1", "title", "heading"], bonne: 0, lang: "HTML" },
  { texte: "Complète pour créer un paragraphe HTML :\n<___ >Bonjour", choix: ["p", "para", "text", "span"], bonne: 0, lang: "HTML" },
  { texte: "Complète pour créer un bouton HTML :\n<___ type=\"button\">Cliquer", choix: ["button", "btn", "click", "input"], bonne: 0, lang: "HTML" },
  { texte: "Complète pour la valeur absolue en Java :\nint abs = Math.___(n);", choix: ["abs", "absolute", "positive", "mod"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour comparer deux chaînes en Java :\nif (s1.___(s2)) { }", choix: ["equals", "==", "compare", "is"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour la taille d'une ArrayList en Java :\nint n = liste.___();", choix: ["size", "length", "count", "total"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour générer un nombre aléatoire en Java :\nMath.___()", choix: ["random", "rand", "random(0,1)", "getRandom"], bonne: 0, lang: "JAVA" },
  { texte: "Complète pour créer un constructeur Java :\npublic ___(String marque) { this.marque = marque; }", choix: ["Voiture", "constructor", "init", "new"], bonne: 0, lang: "JAVA" }
];

// ===================================================
// TIRAGE ALEATOIRE DE 100 QUESTIONS
// ===================================================
function tirerQuestions(banque, nombre) {
  const copie = [...banque];
  const tirees = [];
  for (let i = 0; i < nombre; i++) {
    const index = Math.floor(Math.random() * copie.length);
    tirees.push(copie[index]);
    copie.splice(index, 1);
  }
  return tirees;
}

// ===================================================
// VARIABLES DU JEU
// ===================================================
let questions = [];
const NB_QUESTIONS = 100;
let questionActuelle = 0;
let score = 0;
let chrono;
let tempsRestant = 10;
let reponduDeja = false;
let joueurInfo = null;
let dernierClassement = null;

// ===== ELEMENTS HTML =====
const ecranAccueil    = document.getElementById('ecran-accueil');
const ecranInscription = document.getElementById('ecran-inscription');
const ecranSalle      = document.getElementById('ecran-salle');
const ecranPaiement = document.getElementById('ecran-paiement');
const ecranJeu        = document.getElementById('ecran-jeu');
const ecranResultat   = document.getElementById('ecran-resultat');
const btnJouer        = document.getElementById('btn-jouer');
const btnRejouer      = document.getElementById('btn-rejouer');
const chronoEl        = document.getElementById('chrono');
const scoreEl         = document.getElementById('score-actuel');
const questionEl      = document.getElementById('question-texte');
const choixEl         = document.getElementById('choix-container');
const numQEl          = document.getElementById('num-question');
const barreEl         = document.getElementById('barre-remplissage');
const resultatEl      = document.getElementById('resultat-contenu');


// ===================================================
// SOCKET.IO - EVENEMENTS SERVEUR
// ===================================================

// Mise à jour de la salle d'attente
socket.on('mise-a-jour-salle', (data) => {
  const salleJoueurs = document.getElementById('salle-joueurs');
  const salleNombre  = document.getElementById('salle-nombre');
  if (salleJoueurs) {
    salleJoueurs.innerHTML = data.joueurs
      .map(j => '👤 ' + j.nom + ' ') .join('');
  }
  if (salleNombre) salleNombre.textContent = data.nombre + ' / 20';
});

// Compte à rebours avant la partie
socket.on('compte-rebours', (data) => {
  const compteEl = document.getElementById('compte-rebours');
  if (compteEl) compteEl.textContent = data.compte;
});

// La partie démarre
socket.on('partie-demarree', () => {
  demarrerJeu();
});

socket.on('classement', (data) => {
  dernierClassement = data;
  const liste = document.getElementById('classement-liste');
  if (!liste) return;
  liste.innerHTML = data.slice(0, 5).map((j, i) => 
    '<div class="rang-item">' +
      '<span class="rang-numero">' + (i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : j.rang+'.') + '</span>' +
      '<span class="rang-nom">' + j.nom + '</span>' +
      '<span class="rang-score">' + j.score + ' pts</span>' +
    '</div>'
  ).join('');
});

// ===================================================
// NAVIGATION ENTRE ECRANS
// ===================================================
function afficherEcran(ecran) {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  ecran.classList.add('actif');
}

// ===================================================
// INSCRIPTION DU JOUEUR
// ===================================================
async function inscrireJoueur(nom, telephone) {
  try {
    const reponse = await fetch('https://codeduel-backend.onrender.com/api/joueurs/inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, telephone })
    });
    const data = await reponse.json();

    if (reponse.ok) {
      return data.joueur;
    } else {
      // Si déjà inscrit, essayer la connexion
      const reponse2 = await fetch('https://codeduel-backend.onrender.com/api/joueurs/connexion', {
      method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ telephone })
});
const data2 = await reponse2.json();
if (data2.joueur) return data2.joueur;
return null;
    }
  } catch (err) {
    console.error('Erreur inscription:', err);
    return null;
  }
}

async function rejoindreSalle(nom, telephone) {
  // Afficher un message de chargement
  const btnInscrire = document.getElementById('btn-inscrire');
  btnInscrire.textContent = '⏳ Connexion...';
  btnInscrire.disabled = true;

  try {
    joueurInfo = await inscrireJoueur(nom, telephone);
    
    if (!joueurInfo) {
      alert('Erreur de connexion au serveur. Réessaie dans quelques secondes.');
      btnInscrire.textContent = '✅ Rejoindre';
      btnInscrire.disabled = false;
      return;
    }

    // Rejoindre via Socket.io
    socket.emit('rejoindre', {
      joueurId: joueurInfo._id,
      nom: joueurInfo.nom
    });

    afficherEcran(ecranSalle);

  } catch (err) {
    console.error('Erreur:', err);
    alert('Erreur. Réessaie !');
    btnInscrire.textContent = '✅ Rejoindre';
    btnInscrire.disabled = false;
  }
}
// ===== ECRAN ATTENTE PAIEMENT =====
function afficherEcranPaiement(transactionId) {
  afficherEcran(ecranPaiement);

  // Vérifier le paiement toutes les 5 secondes
  const verification = setInterval(async () => {
    try {
      const reponse = await fetch('https://codeduel-backend.onrender.com/api/paiement/verifier/' + transactionId);
      const data = await reponse.json();

      if (data.approuve) {
        clearInterval(verification);
        // Paiement confirmé, rejoindre la salle
        socket.emit('rejoindre', {
          joueurId: joueurInfo._id,
          nom: joueurInfo.nom
        });
        afficherEcran(ecranSalle);
      }
    } catch (err) {
      console.error('Erreur vérification:', err);
    }
  }, 5000);
}


// ===================================================
// DEMARRER LE JEU
// ===================================================
function demarrerJeu() {
  questions = tirerQuestions(banqueQuestions, NB_QUESTIONS);
  questionActuelle = 0;
  score = 0;
  scoreEl.textContent = '0';
  afficherEcran(ecranJeu);
  afficherQuestion();
}

// ===================================================
// AFFICHER UNE QUESTION
// ===================================================
function afficherQuestion() {
  reponduDeja = false;
  tempsRestant = 10;

  const q = questions[questionActuelle];
  numQEl.textContent = 'Question ' + (questionActuelle + 1);
  const pourcentage = (questionActuelle / NB_QUESTIONS) * 100;
  barreEl.style.width = (pourcentage + 5) + '%';
  const parties = q.texte.split('\n');
  const titre = parties[0];
  const code = parties.slice(1).join('\n');

if (code.trim()) {
  questionEl.innerHTML =
    '<div class="question-titre">' + titre + '</div>' +
    '<div class="code-question">' + code + '</div>';
} else {
  questionEl.textContent = titre;
}

  choixEl.innerHTML = '';
  const lettres = ['A', 'B', 'C', 'D'];
  q.choix.forEach((choix, index) => {
    const btn = document.createElement('button');
    btn.classList.add('choix-btn');
    btn.innerHTML = '' + lettres[index] + ' — ' + choix;
    btn.addEventListener('click', () => choisir(index, btn));
    choixEl.appendChild(btn);
  });

  chronoEl.className = 'chrono';
  chronoEl.textContent = tempsRestant;
  demarrerChrono();
}

// ===================================================
// CHRONO
// ===================================================
function demarrerChrono() {
  clearInterval(chrono);
  chrono = setInterval(() => {
    tempsRestant--;
    chronoEl.textContent = tempsRestant;
    if (tempsRestant <= 3)      chronoEl.className = 'chrono critique';
    else if (tempsRestant <= 6) chronoEl.className = 'chrono urgent';
    if (tempsRestant <= 0) { clearInterval(chrono); tempsEcoule(); }
  }, 1000);
}

// ===================================================
// TEMPS ECOULE
// ===================================================
function tempsEcoule() {
  if (reponduDeja) return;
  reponduDeja = true;
  const boutons = choixEl.querySelectorAll('.choix-btn');
  boutons[questions[questionActuelle].bonne].classList.add('correct');
  setTimeout(questionSuivante, 1500);
}

// ===================================================
// CHOISIR UNE REPONSE
// ===================================================
function choisir(index, btn) {
  if (reponduDeja) return;
  reponduDeja = true;
  clearInterval(chrono);

  const bonne = questions[questionActuelle].bonne;
  if (index === bonne) {
    let points = tempsRestant >= 8 ? 100 : tempsRestant >= 5 ? 70 : 50;
    score += points;
    scoreEl.textContent = score;
    btn.classList.add('correct');
    lancerConfettis();

    // Envoyer le score au serveur
    socket.emit('envoyer-score', { score });
  } else {
    btn.classList.add('incorrect');
    choixEl.querySelectorAll('.choix-btn')[bonne].classList.add('correct');
  }
  setTimeout(questionSuivante, 1500);
}

function questionSuivante() {
  questionActuelle++;

  if (questionActuelle >= NB_QUESTIONS) {
    afficherResultat();
  } else {
    afficherPauseClassement();
  }
}

// ===== PAUSE CLASSEMENT ENTRE QUESTIONS =====
function afficherPauseClassement() {
  const classement = getClassementLocal();
  const leader = classement[0];

  // Bloquer les choix pendant la pause
  const boutons = choixEl.querySelectorAll('.choix-btn');
  boutons.forEach(b => b.disabled = true);

  // Afficher l'overlay de pause
  const overlay = document.createElement('div');
  overlay.id = 'pause-overlay';
  overlay.innerHTML =
    '<div class="pause-contenu">' +
      '<div class="pause-titre">⏸ Classement</div>' +
      '<div class="pause-leader">' +
        '<span class="pause-couronne">👑</span>' +
        '<span class="pause-nom">' + (leader ? leader.nom : '...') + '</span>' +
        '<span class="pause-score">' + (leader ? leader.score + ' pts' : '0 pts') + '</span>' +
      '</div>' +
      '<div class="pause-liste">' +
        classement.slice(0, 5).map((j, i) =>
          '<div class="pause-rang">' +
            '<span class="pause-rang-num">' + (i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)+'.') + '</span>' +
            '<span class="pause-rang-nom">' + j.nom + '</span>' +
            '<span class="pause-rang-score">' + j.score + ' pts</span>' +
          '</div>'
        ).join('') +
      '</div>' +
      '<div class="pause-chrono" id="pause-compte">3</div>' +
    '</div>';

  document.body.appendChild(overlay);

  // Compte à rebours de 3 secondes
  let compte = 5;
  const timer = setInterval(() => {
    compte--;
    const compteEl = document.getElementById('pause-compte');
    if (compteEl) compteEl.textContent = compte;
    if (compte <= 0) {
      clearInterval(timer);
      overlay.remove();
      afficherQuestion();
    }
  }, 1000);
}

// ===== CLASSEMENT LOCAL =====
function getClassementLocal() {
  // Utilise le dernier classement reçu du serveur
  return dernierClassement || [{ nom: joueurInfo ? joueurInfo.nom : 'Toi', score: score }];
}

// ===================================================
// AFFICHER LE RESULTAT
// ===================================================
function afficherResultat() {
  clearInterval(chrono);
  afficherEcran(ecranResultat);

  const max = NB_QUESTIONS * 100;
  const pourcentage = Math.round((score / max) * 100);
  let emoji, message;
  if (pourcentage >= 80)      { emoji = '🏆'; message = 'Excellent ! Tu es un(e) pro du code !'; lancerConfettis(); lancerConfettis(); }
  else if (pourcentage >= 50) { emoji = '👏'; message = 'Bien joué ! Continue comme ça !'; }
  else                        { emoji = '💪'; message = 'Courage ! La pratique mène à la perfection !'; }

  resultatEl.innerHTML = `
    <div class="resultat-titre">${emoji}</div>
    <div class="resultat-score">${score} pts</div>
    <div class="resultat-message">${message}</div>
  `;
}

// ===================================================
// CONFETTIS
// ===================================================
function lancerConfettis() {
  const couleurs = ['#7C3AED','#EC4899','#F59E0B','#06B6D4','#10B981','#F97316','#FFFFFF'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.classList.add('confetti');
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = couleurs[Math.floor(Math.random() * couleurs.length)];
      c.style.width  = (Math.random() * 8 + 6) + 'px';
      c.style.height = (Math.random() * 8 + 6) + 'px';
      c.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3500);
    }, i * 30);
  }
}

// ===================================================
// PARTICULES DE FOND
// ===================================================
function creerParticules() {
  const container = document.getElementById('particules');
  const couleurs = ['#7C3AED', '#EC4899', '#F59E0B', '#06B6D4', '#10B981', '#F97316'];
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.classList.add('particule');
    const taille = Math.random() * 8 + 4;
    p.style.width  = taille + 'px';
    p.style.height = taille + 'px';
    p.style.left   = Math.random() * 100 + '%';
    p.style.background = couleurs[Math.floor(Math.random() * couleurs.length)];
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    p.style.animationDelay    = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

// ===================================================
// EVENEMENTS BOUTONS
// ===================================================
btnJouer.addEventListener('click', () => {
  afficherEcran(ecranInscription);
});

btnRejouer.addEventListener('click', demarrerJeu);

// Formulaire d'inscription
const btnInscrire = document.getElementById('btn-inscrire');
if (btnInscrire) {
  btnInscrire.addEventListener('click', () => {
    const nom = document.getElementById('input-nom').value.trim();
    const telephone = document.getElementById('input-telephone').value.trim();
    if (!nom || !telephone) {
      alert('Entre ton nom et ton numéro de téléphone !');
      return;
    }
    rejoindreSalle(nom, telephone);
  });
}

// ===== CHAT =====
const chatInput  = document.getElementById('chat-input');
const chatBtn    = document.getElementById('chat-envoyer');

function envoyerMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  socket.emit('message-chat', { message: msg });
  chatInput.value = '';
}

if (chatBtn) {
  chatBtn.addEventListener('click', envoyerMessage);
}

if (chatInput) {
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') envoyerMessage();
  });
}

socket.on('nouveau-message', (data) => {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;

  const estMoi = joueurInfo && data.nom === joueurInfo.nom;
  const div = document.createElement('div');
  div.classList.add('chat-message', estMoi ? 'moi' : 'autre');
  div.innerHTML =
    '<div class="msg-nom">' + data.nom + '</div>' +
    '<div class="msg-texte">' + data.message + '</div>' +
    '<div class="msg-heure">' + data.heure + '</div>';

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// ===== CLASSEMENT LIVE PENDANT JEU =====
socket.on('classement', (data) => {
  const liste = document.getElementById('classement-liste');
  if (!liste) return;
  liste.innerHTML = data.slice(0, 5).map((j, i) => 
    '<div class="rang-item">' +
      '<span class="rang-numero">' + (i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : j.rang+'.') + '</span>' +
      '<span class="rang-nom">' + j.nom + '</span>' +
      '<span class="rang-score">' + j.score + ' pts</span>' +
    '</div>'
  ).join('');
});

// ===================================================
// LANCEMENT
// ===================================================
creerParticules();
  