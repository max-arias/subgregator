<script>
  import { Link, ListItem, UnorderedList, InlineLoading, Search } from 'carbon-components-svelte';

  import debounce from 'lodash/debounce.js';

  let value = '';
  let searching = false;
  let abortController = null;
  let searchResults = [];

  const BASE_MOVIE_DB_URL = import.meta.env.VITE_BASE_MOVIE_DB_URL;
  const MOVIE_DB_API_KEY = import.meta.env.VITE_MOVIE_DB_API_KEY;

  // TODO: Move to service
  const fetchSearchResults = (term) => {
    if (term?.length >= 3) {
      searching = true;

      if (abortController) abortController.abort();

      abortController = new AbortController();
      const signal = abortController.signal;

      const url = `${BASE_MOVIE_DB_URL}/search/multi?query=${term}&api_key=${MOVIE_DB_API_KEY}&include_adult=false`;

      fetch(url, { signal })
        .then(async (res) => {
          const data = await res.json();
          searchResults = data?.results || [];

          searching = false;
        })
        .catch(function (e) {
          console.log(' error: ' + e.message);
          searching = false;
        });
    } else {
      searching = false;
    }
  };

  const handleInput = (e) => {
    const term = e.target.value;
    fetchSearchResults(term);
  };

  const debouncedInput = debounce(handleInput, 350);
</script>

<h1 class="text-3xl font-bold underline text-center pb-4 pt-4 sm:pt-8 md:pt-12">Find your subtitle</h1>

<Search bind:value on:input={debouncedInput} />

{#if searching}
  <InlineLoading status="active" description="Searching..." class="pt-4" />
{/if}

{#if searchResults.length}
  <UnorderedList>
    {#each searchResults as item}
      <ListItem>
        <Link href={`/subtitles/${item.media_type}-${item.id}`}>
          {item.title}
        </Link>
      </ListItem>
    {/each}
  </UnorderedList>
{/if}
