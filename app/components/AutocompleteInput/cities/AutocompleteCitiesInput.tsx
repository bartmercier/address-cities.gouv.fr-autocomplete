'use client'
import React, { useEffect, useMemo, useState } from 'react';
import '/app/components/AutocompleteInput/AutocompleteInput.css';
import {
  getCitiesByName,
  GetCitiesByNameResponse,
} from '@/app/api/CityService';
import debounce from 'lodash.debounce';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function AutocompleteCitiesInput() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResult, setSearchResult] = useState<GetCitiesByNameResponse>([]);
  const [showResults, setShowResults] = useState(false);

  const searchCities = async (value: string) =>
    setSearchResult(await getCitiesByName(value));
  const debouncedSearchCities = useMemo(() => debounce(searchCities, 500), []);

  const onInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowResults(event.target.value !== '');
    setSearchTerm(event.target.value);
    debouncedSearchCities(event.target.value);
  };

  const selectCity = (name: string, codesPostaux:string) => {
    setShowResults(false);
    setSearchTerm(name + " " + codesPostaux);
    setSearchResult([]);
  };

  const results = searchResult.map((resultItem) => (
    <p key={resultItem.code} onClick={() => selectCity(resultItem.nom, resultItem.codesPostaux[0]!)}>
      {resultItem.nom} { } {resultItem.codesPostaux[0]}
    </p>
  ));

  useEffect(() => {
    return () => {
      debouncedSearchCities.cancel();
    };
  }, []);

  return (
    <>
      <div className='w-4/6'>
        <div className="input">
          <Input type="text" className="rounded-sm" value={searchTerm} onChange={onInputValueChange} placeholder='saisissez une ville' />
        </div>
        {showResults && <div className="results">{results}</div>}
      </div>

    </>
  );
}

export default AutocompleteCitiesInput;