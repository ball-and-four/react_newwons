import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({ onClose }: { onClose: () => void }) => {
  const escapeEmailId = (id: string) => {
    return String(id || '').replace(/\./g, '_'); // "." → "_"
  };

  const { user } = useAuth();
  const getEmailIdPattern = /^[^@]+/;
  const userEmailIdAsIs = user?.email?.match(getEmailIdPattern)?.[0] || '';
  const userEmailId = escapeEmailId(userEmailIdAsIs);
  const [pickColor, setPickColor] = useState('');

  //선택하기
  const handleClickColorPick = async () => {
    if (!userEmailId) {
      console.error('Cannot save color: User email ID not found.');
      onClose();
      return;
    }

    const docRef = doc(db, 'userColors', 'list');
    try {
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data() : {};

      const updatedData = {
        ...currentData,
        [userEmailId]: pickColor || '#888',
      };

      await updateDoc(docRef, updatedData);

      console.log(`Color ${pickColor || '#888'} saved for user ${userEmailId}`);
    } catch (error) {
      console.error('Error saving color:', error);
    }
    onClose();
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}
    >
      <h3>사용하실 컬러를 선택해 주세요!</h3>
      <HexColorPicker style={{ margin: '20px auto' }} color={pickColor} onChange={setPickColor} />
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
