const es = require('../locales/es.json');
const en = require('../locales/en.json');
const dictionaries = { es, en };

module.exports = (req, res, next) => {
  let lang = req.query.lang || req.session.lang || req.cookies.lang;
  if (!lang) {
    const acceptLang = req.headers['accept-language'];
    lang = (acceptLang && acceptLang.toLowerCase().startsWith('en')) ? 'en' : 'es';
  }
  if (lang !== 'es' && lang !== 'en') {
    lang = 'es';
  }
  req.session.lang = lang;
  res.cookie('lang', lang, { maxAge: 1000 * 60 * 60 * 24 * 365 });
  
  res.locals.lang = lang;
  res.locals.__ = (key) => {
    const dict = dictionaries[lang] || es;
    return dict[key] !== undefined ? dict[key] : key;
  };
  next();
};
