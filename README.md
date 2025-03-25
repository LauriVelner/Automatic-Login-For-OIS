# Automatic Login For ÕIS
ÕIS logib kasutaja peale 55 minutit mitteaktiivsust välja, mis võib ajapikku väga tülikaks muutuda. See skript logib kasutaja automaatselt sisse ja hoiab sisse logituna. 

Iga 180 päeva tagant tuleb end audentida läbi vastava rakenduse, aga peale selle teeb see skript kõik vajaliku, et sisselogimisprotsess oleks kiire ja ei lase kasutajat mitteaktiivsuse tõttu välja logida.

## Kasutamine
Kui parool ja email on juba brauseri mälus, siis pole vaja midagi teha.  

## Kuidas alla laadida?
1. Et skripti joosta, on vaja *userscript*e haldavat brauserilaiendit. Tampermonkey on üks neist:

Firefox: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/

Chrome: https://chromewebstore.google.com/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf

2. Seejärel saab skripti allalaadida siit: https://greasyfork.org/en/scripts/530632-automatic-login-for-%C3%B5is