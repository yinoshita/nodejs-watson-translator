const express = require('express');
const app = express();
const port = 3000;

const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// GETリクエスト処理
//app.get('/', (req, res) => res.send('Hello!'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
}); 

// POSTリクエスト処理
app.post('/', (req, res) => {
    // req.queryでクエリパラメータ取得
    let sourcestr = req.body.sourcestr;

    console.log(sourcestr);

    let returnmsg = '';

    // Watson Translatorを呼び出す
    const languageTranslator = new LanguageTranslatorV3({
        version: '2018-05-01',
        authenticator: new IamAuthenticator({
          apikey: 'Eg8hi4iLnhM2DeZ7W2m9ihC4QQfKtKxjVH17zKzTC-Za',
        }),
        serviceUrl: 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/000d3e70-bf10-4776-a5a7-6a6fd6b9f6df',
      });
      
      // Watson Translatorへ渡すパラメーターの設定
      const translateParams = {
        text: sourcestr,
        modelId: 'en-ja',
      };
      
      // Watson Translatorの呼び出し処理
      languageTranslator.translate(translateParams)
        .then(translationResult => {
          console.log(JSON.stringify(translationResult, null, 2));

          // 戻り値から翻訳後の文章を取り出す
          returnmsg = translationResult.result.translations[0].translation;
          console.log(returnmsg);

          // 結果を返す
          res.send('翻訳結果：「' + returnmsg + '」');
          //res.redirect("/");
        })
        .catch(err => {
          console.log('error:', err);
          res.send('Watson APIの呼び出しでエラーになりました：エラー内容 (' + err + ')');
        });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
