console.log("=== 서버 파일 읽기 시작 ===");

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

console.log("모듈 로드 완료!");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Google Gemini API Key 설정 (여기에 본인 API 키를 직접 넣어서 테스트해보세요!)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "your_gemini_api_key_here";

app.post('/api/summarize', async (req, res) => {
    try {
        const { userProfile, reviews } = req.body;

        if (!reviews || reviews.length === 0) {
            return res.status(400).json({ error: "요약할 리뷰 데이터가 없습니다." });
        }

        const prompt = `
당신은 35~50세 주부 고객들을 위한 스마트 쇼핑 AI 에이전트입니다.
아래 고객 프로필과 상품의 실제 리뷰들을 바탕으로, 이 상품이 이 고객에게 적합한지 3줄로 요약해 주세요.

[고객 프로필]
- 타깃: ${userProfile ? userProfile.target : "35~50세 주부"}
- 주의 사항: ${userProfile ? userProfile.concern : "안전하고 가성비 좋은 상품 선호"}

[상품 실제 리뷰 데이터]
${reviews.map(r => `- ${r}`).join('\n')}

[출력 형식]
1. 우리 집 맞춤 적합도: (고객 프로필 관점에서 이 상품이 왜 좋은지/안 좋은지 한 줄 요약)
2. 실구매자 리뷰 요약: (리뷰어들이 공통적으로 말하는 장단점 한 줄 요약)
3. AI 최종 추천 가이드: (이 상품을 살지 말지 최종 조언 한 줄)
`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const candidate = response.data.candidates?.[0];
        if (candidate) {
            const summaryText = candidate.content.parts[0].text;
            res.json({ success: true, summary: summaryText });
        } else {
            res.status(500).json({ success: false, error: "AI 응답을 생성하지 못했습니다." });
        }

    } catch (error) {
        console.error("API 호출 에러:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: "서버 내부 오류가 발생했습니다." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 서버가 포트 ${PORT}에서 아주 잘 돌아가고 있습니다!`);
});