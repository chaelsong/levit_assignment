import React, { useState } from 'react';
import axios from 'axios';

// 1. 상품 데이터 리스트
const products = [
  {
    id: 1,
    name: "🥩 유기농 한우 국거리 세트",
    reviews: ["고기가 부드럽고 잡내가 없어요", "국물 진하게 잘 우러납니다", "가격이 살짝 비싸지만 가치 있어요"]
  },
  {
    id: 2,
    name: "🐟 저염 순살 고등어 10팩",
    reviews: ["정말 하나도 안 짜서 아이들 주기 딱 좋아요", "비린 맛 없이 고소합니다", "포장이 낱개로 되어 있어 편리해요"]
  },
  {
    id: 3,
    name: "🍎 친환경 무농약 부사 사과",
    reviews: ["과즙이 풍부하고 아삭아삭 달콤해요", "크기가 고르고 신선합니다", "상한 것 없이 안전하게 잘 도착했어요"]
  },
  {
    id: 4,
    name: "🍅 유기농 무농약 방울토마토",
    reviews: ["껍질이 얇고 당도가 아주 높아요", "아이들 간식용으로 씻어두기 편합니다", "신선도가 오래 유지돼요"]
  }
];

// 3번 기능: 가족 구성원(페르소나) 리스트
const personas = [
  { id: 'mom', title: "초등학생 자녀를 둔 주부", desc: "아이들 건강과 영양 균형 최우선" },
  { id: 'senior', title: "부모님 건강을 챙기는 자녀", desc: "저당, 저염, 소화 흡수 중심" },
  { id: 'single', title: "1인 가구 자취생", desc: "간편 조리, 가성비, 소포장 중심" }
];

function App() {
  // 상태 관리
  const [selectedPersona, setSelectedPersona] = useState(personas[0]); // 선택된 페르소나
  const [selectedProduct, setSelectedProduct] = useState(products[0]);   // 선택된 상품
  const [presetConcern, setPresetConcern] = useState('저염 선호');         // 선택된 태그 성향
  const [customConcern, setCustomConcern] = useState('');                 // 1번 기능: 직접 입력 성향
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // 최종 반영될 성향 (직접 입력한 값이 있으면 그 값을 우선 사용)
  const activeConcern = customConcern.trim() !== '' ? customConcern : presetConcern;

  // 백엔드 API 연결 로직
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/summarize', {
        userProfile: { 
          target: selectedPersona.title, // 선택된 페르소나 적용
          concern: activeConcern          // 선택 또는 직접 입력한 성향 적용
        },
        reviews: selectedProduct.reviews 
      });
      setSummary(response.data.summary);
    } catch (error) {
      alert("AI 요약을 불러오는 데 실패했어요!");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '420px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>🍎 우리 가족 맞춤 쇼핑</h2>
      
      {/* 3번 기능: 가족 구성원(페르소나) 선택 UI */}
      <div style={{ margin: '15px 0' }}>
        <h4 style={{ marginBottom: '8px' }}>👤 쇼핑 주체 (가족 구성원)</h4>
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setSelectedPersona(p);
              setSummary(null);
            }}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '5px',
              padding: '8px 10px',
              backgroundColor: selectedPersona.id === p.id ? '#ff5722' : '#f0f0f0',
              color: selectedPersona.id === p.id ? 'white' : 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '13px'
            }}
          >
            <strong>{p.title}</strong> <span style={{ fontSize: '11px', opacity: 0.8 }}>({p.desc})</span>
          </button>
        ))}
      </div>

      {/* 상품 선택 UI */}
      <div style={{ margin: '15px 0' }}>
        <h4 style={{ marginBottom: '8px' }}>📦 상품 선택</h4>
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => {
              setSelectedProduct(product);
              setSummary(null);
            }}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '5px',
              padding: '8px 10px',
              backgroundColor: selectedProduct.id === product.id ? '#333' : '#f0f0f0',
              color: selectedProduct.id === product.id ? 'white' : 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '13px'
            }}
          >
            {product.name}
          </button>
        ))}
      </div>

      {/* 성향 선택 태그 */}
      <div style={{ margin: '15px 0' }}>
        <h4 style={{ marginBottom: '8px' }}>🎯 우리 가족 성향 태그</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {['저염 선호', '국산 재료', '가성비 최고', '유기농 인증'].map((tag) => (
            <button 
              key={tag}
              onClick={() => {
                setPresetConcern(tag);
                setCustomConcern(''); // 태그 누르면 직접 입력창 초기화
              }}
              style={{ 
                padding: '6px 10px', 
                backgroundColor: (presetConcern === tag && !customConcern) ? '#ff5722' : '#eee', 
                color: (presetConcern === tag && !customConcern) ? 'white' : 'black', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '12px'
              }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 1번 기능: 직접 입력 성향 텍스트박스 */}
      <div style={{ margin: '15px 0' }}>
        <h4 style={{ marginBottom: '8px' }}>✏️ 우리 가족 특이사항 직접 입력</h4>
        <input 
          type="text" 
          placeholder="예: 견과류 알레르기가 있어, 당뇨 관리 중 등"
          value={customConcern}
          onChange={(e) => setCustomConcern(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '13px'
          }}
        />
      </div>

      {/* 요약 버튼 */}
      <button 
        onClick={fetchSummary} 
        style={{ width: '100%', padding: '12px', backgroundColor: '#ff5722', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
        {loading ? "AI가 요약 중..." : "✨ AI 맞춤 요약 보기"}
      </button>

      {/* AI 요약 카드 */}
      {summary && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '10px', border: '1px solid #ddd' }}>
          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>💬 AI 맞춤 분석 리포트</h3>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            [적용 조건] {selectedPersona.title} / 성향: {activeConcern}
          </p>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: '1.5', fontSize: '13px' }}>{summary}</pre>
        </div>
      )}
    </div>
  );
}

export default App;