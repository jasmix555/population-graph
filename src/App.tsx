import React from 'react';
import { PrefectureCheckboxes } from './components/PrefectureCheckbox';
import { usePrefectures } from './api/hooks/usePrefectures';
import useLocalStorage from './hooks/useLocalStorage';
import { PopulationChart } from './components/PopulationChart';
import useCurrentPrefectures from './hooks/useCurrentPrefectures';
import style from './App.module.css';
import Layout from './layout/layout';

const App: React.FC = () => {
  const { prefectures, isLoading, isError } = usePrefectures();
  const [selectedPrefectures, setSelectedPrefectures] = useLocalStorage<
    number[]
  >('selectedPrefectures', []);
  const { currentPrefectures, setCurrentPrefectures } = useCurrentPrefectures(
    selectedPrefectures,
    prefectures,
  );

  const handlePrefectureChange = (prefCode: number) => {
    setSelectedPrefectures((prevSelected) =>
      prevSelected.includes(prefCode) ?
        prevSelected.filter((code) => code !== prefCode)
      : [...prevSelected, prefCode],
    );

    const selectedPrefecture = prefectures.find(
      (pref) => pref.prefCode === prefCode,
    );
    if (selectedPrefecture) {
      setCurrentPrefectures((prevSelected) =>
        prevSelected.includes(selectedPrefecture) ?
          prevSelected.filter((pref) => pref.prefCode !== prefCode)
        : [...prevSelected, selectedPrefecture],
      );
    }
  };

  if (isLoading) {
    return <div className={style.loader}>Loading...</div>;
  }

  if (isError) {
    return <div className={style.loader}>Error loading prefectures.</div>;
  }

  return (
    <Layout>
      <h2 className={style.header}>都道府県</h2>
      <div className={style.prefecture}>
        <PrefectureCheckboxes
          selectedPrefectures={selectedPrefectures}
          onChange={handlePrefectureChange}
          setSelectedPrefectures={setSelectedPrefectures}
        />
      </div>
      <PopulationChart selectedPrefectures={currentPrefectures} />
    </Layout>
  );
};

export default App;
