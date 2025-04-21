export default {
  async fetch(request, env, ctx) {
    // 1. Use KV
    const kvValue = await env.MY_KV_NAMESPACE.get("my-key");

    // 2. Use D1 (SQL query)
    const { results } = await env.MY_D1_DATABASE.prepare(
      "SELECT * FROM my_table LIMIT 1"
    ).all();

    // 3. Use R2 (fetch an object)
    const r2Object = await env.MY_R2_BUCKET.get("example.txt");
    const r2Text = r2Object ? await r2Object.text() : "Not found";

    // 4. Use Workers AI (LLM inference)
    const aiResponse = await env.MY_AI.run("@cf/meta/llama-3-8b-instruct", {
      prompt: "Say hello from Cloudflare AI!",
    });

    // 5. Use AutoRAG (ask a question)
    const autoragResponse = await env.MY_AUTORAG_INSTANCE.query({
      query: "What is AutoRAG?",
    });

    // Compose result
    return new Response(
      JSON.stringify({
        kvValue,
        d1Result: results,
        r2Text,
        aiResponse,
        autoragResponse,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
};
