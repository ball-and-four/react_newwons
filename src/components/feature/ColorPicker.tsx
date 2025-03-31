import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const getEmailIdPattern = /^[^@]+/;
  const userEmailId = `${user?.email?.match(getEmailIdPattern)}` || 'default';

  const [pickColor, setPickColor] = useState('');
  const handleChangeColor = () => {
    return pickColor;
  };

  //선택하기
  const handleClickColorPick = async () => {
    const docRef = doc(db, 'userColors', 'list');
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    try {
      await updateDoc(doc(db, 'userColors', 'list'), {
        ...data,
        [userEmailId]: pickColor || '#888',
      });
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}
    >
      <h3>사용하실 컬러를 선택해 주세요!</h3>
      <HexColorPicker
        style={{ margin: '20px auto' }}
        color={pickColor}
        onClick={handleChangeColor}
        onChange={setPickColor}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '10px',
          width: '100%',
        }}
      >
        <div
          style={{
            margin: '10px 0 20px',
          }}
        >
          preview :{' '}
          <span
            style={{
              display: 'inline-block',
              backgroundColor: `${pickColor}`,
              color: 'white',
            }}
          >
            EVENT
          </span>
        </div>
      </div>
      <button onClick={handleClickColorPick}>선택하기</button>
    </div>
  );
};
export default ColorPicker;
