<script context="module">
  export async function load({ params, fetch, session, stuff }) {
    const { type, id, title } = params;
    const { details, subtitles } = await fetch(`/subtitles/${type}-${id}-${title}.json`).then((r) => r.json());

    return {
      props: {
        details,
        subtitles,
      },
    };
  }
</script>

<script>
  import { CodeSnippet } from 'carbon-components-svelte';
  export let details;
  export let subtitles;

  const stringDetails = JSON.stringify(details);
  const stringSubtitles = JSON.stringify(subtitles);
</script>

<CodeSnippet type="multi" wrapText code={stringDetails} />

<CodeSnippet type="multi" wrapText code={stringSubtitles} />
