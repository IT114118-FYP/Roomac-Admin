import React from "react";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";
import { searchClient, searchIndexName } from "../api/config";

export default function SearchBar() {
	return (
		<InstantSearch
			indexName={searchIndexName.PROGRAM}
			searchClient={searchClient}
		>
			<SearchBox />
			<Hits />
		</InstantSearch>
	);
}
