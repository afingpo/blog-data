const fs = require('fs');

async function run() {
  const issueBody = process.env.ISSUE_BODY;
  // 正则匹配模板中的 key，适应常见 Markdown 格式
  const extract = (key) => {
    const regex = new RegExp(`### ${key}\\s*\\n([^#]+)`, 'i');
    const match = issueBody.match(regex);
    return match ? match[1].trim() : null;
  };

  const data = {
    title: extract('title'),
    siteurl: extract('siteurl'),
    desc: extract('desc'),
    imgurl: extract('imgurl')
  };

  // 检查是否完整
  if (!data.title || !data.siteurl || !data.desc || !data.imgurl) {
    console.error("Missing required fields!");
    process.exit(1);
  }

  // 读取并更新 JSON
  const filePath = './src/links.json';
  const links = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  links.push(data);
  fs.writeFileSync(filePath, JSON.stringify(links, null, 2));
  console.log("JSON updated successfully.");
}

run().catch(err => { console.error(err); process.exit(1); });

