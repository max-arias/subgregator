<script>
  import { Link, ListItem, UnorderedList, Search } from 'carbon-components-svelte';

  import debounce from 'lodash/debounce.js';

  let value = '';
  let searching = false;
  let abortController = null;
  let searchResults = [];

  const fetchSearchResults = async (term) => {
    if (term?.length >= 3) {
      if (abortController) abortController.abort();

      abortController = new AbortController();
      const signal = abortController.signal;

      const { results } = await fetch(`/search.json?term=${term}`, { signal }).then((r) => r.json());

      searchResults = results;

      console.log(searchResults);
    }
  };

  const handleInput = (e) => {
    const term = e.target.value;
    fetchSearchResults(term);
  };

  const debouncedInput = debounce(handleInput, 350);

  const hyphenedNamed = (title) =>
    title
      .split(' ')
      .join('-')
      .replace(/[^a-zA-Z0-9-_]+/gi, '')
      .toLowerCase();
</script>

<h1 class="text-3xl font-bold underline text-center pb-4 pt-4 sm:pt-8 md:pt-12">Find your subtitle</h1>

<Search bind:value on:input={debouncedInput} />

{#if searchResults.length}
  <UnorderedList>
    {#each searchResults as item}
      <ListItem>
        <Link href={`/subtitles/${item.media_type}-${item.id}-${hyphenedNamed(item.title || item.original_name)}`}>
          {item.title || item.original_name}
        </Link>
      </ListItem>
    {/each}
  </UnorderedList>
{/if}
