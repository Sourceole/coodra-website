export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'callout'; text: string }

export type BlogPostRecord = {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  coverImageAlt: string
  category: string
  readingTime: string
  author: string
  publishedAt: string
  isoPublishedAt: string
  content: ContentBlock[]
}

export const blogPosts: BlogPostRecord[] = [
  {
    slug: 'inventory-mistakes-that-kill-margin',
    title: '5 inventory mistakes that kill margin (and how to catch them before they do)',
    excerpt:
      'A practical framework for spotting hidden inventory drag early and turning signals into high-confidence actions.',
    coverImage: '/images/blog/inventory-mistakes-infographic.svg',
    coverImageAlt: 'Inventory mistakes infographic',
    category: 'Inventory',
    readingTime: '7 min read',
    author: 'Michael Shahid (CEO)',
    publishedAt: 'April 13, 2026',
    isoPublishedAt: '2026-04-13',
    content: [
      {
        type: 'paragraph',
        text: 'Every retailer has experienced it. You review your numbers at the end of the month and the margin looks worse than it should. Not because of pricing — but because of decisions made weeks earlier, when the signals were already there.',
      },
      {
        type: 'paragraph',
        text: 'This is the quiet cost of inventory mismanagement. It does not show up as a dramatic loss. It shows up as slow weeks that should have been fast, stock that sat too long, and reorders placed on instinct instead of data.',
      },
      {
        type: 'paragraph',
        text: 'These five mistakes are the most common. Coodra is built to catch all of them before they compound.',
      },
      {
        type: 'image',
        src: '/images/blog/inventory-mistakes-infographic.svg',
        alt: 'Five inventory management mistakes that erode retail margin, with icons for each mistake',
        caption: 'The five most compounding inventory mistakes in independent retail.',
      },
      {
        type: 'callout',
        text: 'Mistake 1: Reordering the same quantities every cycle — regardless of actual demand',
      },
      {
        type: 'paragraph',
        text: 'Most independent retailers fall into a rhythm: reorder the same SKUs in the same quantities, on the same schedule. It is efficient. It feels safe. It is one of the most expensive habits in retail.',
      },
      {
        type: 'paragraph',
        text: 'The problem is that demand changes. A product that sold 20 units a week six months ago might now sell 12. If you keep ordering for the old number, you will accumulate dead stock — capital locked up in inventory that sits and eventually forces a discounted clearance sale.',
      },
      {
        type: 'paragraph',
        text: 'The same applies in reverse. A product that is climbing in velocity is a signal, not just a trend. Ignoring it means you run out at the worst moment: when customers are actively looking and you have nothing to offer.',
      },
      {
        type: 'paragraph',
        text: 'Coodra surfaces your top sellers and flags when a fast-mover is trending upward before you accidentally reorder below the level that serves your customers. <a href="/integrations">See how it works with your POS</a>.',
      },
      {
        type: 'callout',
        text: 'Mistake 2: No safety stock for high-turn items',
      },
      {
        type: 'paragraph',
        text: 'Safety stock is not a luxury for enterprise retailers. For any SKU that sells consistently — especially a hero product or a category anchor — running with zero buffer is a known risk that most independent operators take anyway.',
      },
      {
        type: 'paragraph',
        text: 'When a high-velocity item goes out of stock, you do not just lose that sale. You lose the next three sales while you wait for emergency replenishment. Emergency orders cost more, arrive slower, and often come in incomplete quantities.',
      },
      {
        type: 'paragraph',
        text: 'A simple safety stock calculation for a consistent seller: multiply your average weekly velocity by two. That is your reorder threshold, not your reorder quantity. Use it to set a trigger, not a target.',
      },
      {
        type: 'paragraph',
        text: 'Coodra flags low-inventory items against your sales velocity every week, so the safety stock conversation happens automatically — not in a manager\'s head. <a href="/integrations">Connect your POS and get started</a>.',
      },
      {
        type: 'callout',
        text: 'Mistake 3: Reacting to stockouts instead of preventing them',
      },
      {
        type: 'paragraph',
        text: 'By the time a retailer notices a stockout, the damage is done. The customer went somewhere else. The staff noted the gap. A reorder was placed — usually at a higher cost, with a longer lead time, and with less visibility into the rest of the order cycle.',
      },
      {
        type: 'paragraph',
        text: 'Retailers who manage this well do not react to stockouts. They prevent them with a weekly review: look at what is approaching your reorder point, cross-reference with any known upcoming demand signals (season, promotion, local event), and place orders before the shelf is bare.',
      },
      {
        type: 'paragraph',
        text: 'This takes 20 minutes a week. The alternative is spending those 20 minutes on the phone explaining to a customer why you do not have the product they came in for.',
      },
      {
        type: 'paragraph',
        text: 'Coodra\'s weekly inventory review surfaces these signals in one view — which SKUs are approaching reorder point, which have been trending up, and which have enough buffer to wait. <a href="/integrations">See the weekly review in action</a>.',
      },
      {
        type: 'callout',
        text: 'Mistake 4: Mixing up products with similar names or UPCs',
      },
      {
        type: 'paragraph',
        text: 'A SKU called "Large Silver Ring" and another called "Large Silver Band" might look different in your system. In your staff\'s mind, they are the same thing. Mis-picks happen. Counts get confused. Returns get logged to the wrong SKU.',
      },
      {
        type: 'paragraph',
        text: 'The result is a quiet bleed of inventory accuracy. You think you have 30 of one product. You have 20 of that product and 10 of another. The stock discrepancy does not surface until a manager notices a pattern of adjustments.',
      },
      {
        type: 'paragraph',
        text: 'Fixing this requires a clean-up of your POS SKU names and a re-labeling of any physically ambiguous items. It is not exciting work. It is the kind of operational maintenance that separates retailers with reliable data from retailers who are always guessing.',
      },
      {
        type: 'paragraph',
        text: 'Coodra\'s inventory reconciliation flags SKUs with anomalous movement — which is often the first sign of a mis-pick or count error compounding silently.',
      },
      {
        type: 'callout',
        text: 'Mistake 5: Making purchasing decisions without knowing true cost per SKU',
      },
      {
        type: 'paragraph',
        text: 'Margin is not just the difference between your price and the supplier\'s invoice price. It includes freight, handling, shrinkage, and the cost of capital tied up in inventory. A product that appears to deliver a 35% margin might deliver 22% once all of those costs are accounted for.',
      },
      {
        type: 'paragraph',
        text: 'If you are making reorder decisions on gross margin — or worse, on intuition — you are almost certainly misallocating capital. You are likely over-ordering on products that feel profitable but are not, while under-ordering on products that genuinely deliver strong net margin.',
      },
      {
        type: 'paragraph',
        text: 'The fix is not complex. Know your landed cost per SKU. At minimum, know your freight-adjusted cost. If you do not have this broken out in your POS data, Coodra can help you surface it from your order history and start ranking SKUs by actual contribution margin rather than top-line revenue. <a href="/pricing">See pricing and plans</a>.',
      },
      {
        type: 'paragraph',
        text: 'One metric that surfaces this cleanly: the <a href="/blog/stock-to-sales-ratio-guide">stock-to-sales ratio</a>. If you have more than 4 weeks of supply on hand on a SKU, the carrying cost is quietly eroding your margin — whether or not you have tracked it explicitly. <a href="/case-studies">See how retailers have caught this early</a>.',
      },
      {
        type: 'paragraph',
        text: 'These five mistakes are not unique to one type of retailer. The specifics vary — the pattern is the same across jewelry, grocery, pharmacy, and specialty retail.',
      },
      {
        type: 'paragraph',
        text: 'The question is not whether these mistakes are happening in your store. The question is whether you have a system that catches them before they compound into margin damage you cannot recover in the same quarter. <a href="/blog/dead-inventory-signs">See the five signals that dead stock is already accumulating</a>.',
      },
      {
        type: 'paragraph',
        text: 'Coodra reviews your sales, inventory, and demand signals every week and <a href="/inventory-management">surfaces the five decisions most worth acting on</a> — ranked by impact on your margin, not by urgency alone.',
      },
      {
        type: 'paragraph',
        text: 'Start your free trial and see what your inventory data has been telling you.',
      },
    ],
  },
  {
    slug: 'pos-data-trust-guide',
    title: 'Shopify vs Square vs Lightspeed: which POS data should you trust for inventory decisions?',
    excerpt:
      'How to evaluate signal quality across POS platforms and avoid making critical inventory calls on noisy data.',
    coverImage: '/images/blog/erp-vs-pos-comparison.svg',
    coverImageAlt: 'ERP versus POS planning comparison',
    category: 'Industry Trends',
    readingTime: '8 min read',
    author: 'Michael Shahid (CEO)',
    publishedAt: 'April 13, 2026',
    isoPublishedAt: '2026-04-13',
    content: [
      {
        type: 'paragraph',
        text: 'There is a persistent assumption in retail inventory planning that serious demand forecasting requires an ERP system. NetSuite, SAP, Epicor — serious planning requires serious software.',
      },
      {
        type: 'paragraph',
        text: 'For a $3 million independent retailer running Shopify or Square, this assumption is not just wrong. It is actively harmful. It leads operators to either accept inadequate planning or take on a software investment that creates more operational overhead than the inventory problems it was supposed to solve.',
      },
      {
        type: 'paragraph',
        text: 'The real question is not whether independent retailers can do demand forecasting. It is what level of demand forecasting actually moves the needle for a POS-connected store — and whether ERP-adjacent tools are the best way to get there.',
      },
      {
        type: 'paragraph',
        text: 'This is what we have found working with retailers across grocery, pharmacy, jewelry, and specialty retail.',
      },
      {
        type: 'callout',
        text: 'Why ERP-first thinking does not serve independent retailers',
      },
      {
        type: 'paragraph',
        text: 'ERP systems are built for companies with complex supply chains, multiple warehouse locations, and dedicated inventory planners. They assume a certain operational maturity: clean SKU-level data, regular cycle counts, a team member whose job is inventory management.',
      },
      {
        type: 'paragraph',
        text: 'Most independent retailers do not have any of those things. They have a POS that logs every sale, a once-a-week check on what is running low, and an owner who is making purchasing decisions between customer interactions.',
      },
      {
        type: 'paragraph',
        text: 'This is not a gap in the retailer\'s capability. It is a gap in the software market. The tools built for enterprise do not compress well for SMB use cases. You end up paying for modules you will never use, integrations that require IT support, and a learning curve that takes months before the first real planning insight arrives.',
      },
      {
        type: 'paragraph',
        text: 'Coodra was built specifically for this gap — taking POS data from Shopify, Square, or Lightspeed and turning it into ranked, actionable recommendations without requiring a single ERP configuration. <a href="/integrations">See which POS systems connect to Coodra</a>.',
      },
      {
        type: 'callout',
        text: 'The POS-first demand signal: what your point of sale already knows',
      },
      {
        type: 'paragraph',
        text: 'Your POS already knows more about your demand patterns than most retailers realize. Every transaction is a data point. The velocity of each SKU, the day-of-week patterns, the seasonal curves, the co-purchasing relationships — it is all in your sales history.',
      },
      {
        type: 'paragraph',
        text: 'The challenge is not data. It is signal extraction. Raw POS data tells you what sold. It does not tell you what is about to sell, what is about to run out, or which SKU is quietly becoming a faster mover than it was eight weeks ago.',
      },
      {
        type: 'paragraph',
        text: 'What POS-first demand intelligence does is surface those signals automatically. <a href="/inventory-management">Coodra pulls your last 90 days of sales and inventory data</a> and generates a ranked list of inventory decisions — which SKUs to reorder now, which to hold, which to reduce. Updated weekly, based on fresh data from your POS.',
      },
      {
        type: 'image',
        src: '/images/blog/erp-vs-pos-comparison.svg',
        alt: 'Comparison of ERP-first inventory planning vs POS-connected demand intelligence for independent retailers',
        caption: 'Enterprise inventory planning requires months of setup. POS-direct intelligence goes live in a day.',
      },
      {
        type: 'callout',
        text: 'What good demand forecasting actually looks like at independent scale',
      },
      {
        type: 'paragraph',
        text: 'For a 2-3 location retailer running Shopify or Square, good demand forecasting does not mean building an AI model. It means answering five questions every week:',
      },
      {
        type: 'paragraph',
        text: 'Which products am I running low on before they become a stockout?\nWhich products have I been over-ordering relative to their actual velocity?\nIs there a demand trend building on any of my hero SKUs before it shows up as a backorder?\nWhat should I reorder differently this week compared to last week, and why?\nWhich products are approaching the end of their seasonal cycle and need to be reduced or cleared?',
      },
      {
        type: 'paragraph',
        text: 'Answering these five questions from your POS data is what Coodra does every week. It does not require an ERP. It does not require a dedicated planner. It requires connecting your POS once and letting the recommendations come to you.',
      },
      {
        type: 'paragraph',
        text: 'The five outputs are not theoretical. They map directly to margin protection. A missed stockout on your top seller costs you the sale and often the customer. An over-order on a slow-mover costs you the margin on the discounted clearance. Preventing both is what good demand intelligence delivers. <a href="/pricing">See how Coodra pricing works</a>.',
      },
      {
        type: 'callout',
        text: 'The "no ERP required" angle is not a compromise — it is a positioning',
      },
      {
        type: 'paragraph',
        text: 'Independent retailers who have looked at Coodra and asked "why does this not need an ERP?" are asking the right question from the wrong angle. The question is not why Coodra does not need an ERP. The question is why you would add an ERP to solve a problem your POS already has the data to help you solve.',
      },
      {
        type: 'paragraph',
        text: 'The ERP market is built for complexity. Coodra is built for the retailer who wants the outcome — better inventory decisions, protected margin, less firefighting — without the overhead of enterprise software. For a full breakdown of how Coodra builds demand forecasts from POS data alone, <a href="/blog/demand-forecasting-without-an-erp">see our guide to demand forecasting without an ERP</a>.',
      },
      {
        type: 'paragraph',
        text: 'If you are running Shopify, Square, or Lightspeed and you are spending time wondering whether you need an ERP to do inventory planning justice, the honest answer is: probably not. <a href="/signup">Connect your POS to Coodra</a> and see what your data has been telling you.',
      },
      {
        type: 'paragraph',
        text: 'For a direct comparison with one specific ERP-adjacent alternative, <a href="/blog/coodra-vs-netstock">see how Coodra and Netstock stack up for independent retailers</a>.',
      },
    ],
  },
  {
    slug: 'dead-inventory-signs',
    title: '5 Signs Your Store Has Too Much Dead Inventory',
    excerpt:
      'Dead stock quietly drains margin every week it sits. Here are the five signals that tell you it is happening in your store before the damage compounds.',
    coverImage: '/images/blog/dead-inventory-signs.svg',
    coverImageAlt: 'Five warning signs of dead inventory in independent retail stores',
    category: 'Inventory',
    readingTime: '6 min read',
    author: 'Michael Shahid (CEO)',
    publishedAt: 'April 17, 2026',
    isoPublishedAt: '2026-04-17',
    content: [
      {
        type: 'paragraph',
        text: 'Dead inventory is not a catastrophe. It is a quiet, compounding drain. A SKU that should have been marked down in January sits on the shelf until April. The margin on that product erodes a little more every week — not in a dramatic collapse, but in the slow math of capital tied up in inventory that is not turning.',
      },
      {
        type: 'paragraph',
        text: 'The hardest part about dead stock is that it does not announce itself. You have to know what to look for. Here are the five signals that tell you it is happening in your store.',
      },
      {
        type: 'image',
        src: '/images/blog/dead-inventory-signs.svg',
        alt: 'Five warning signs of dead inventory: shelf space, stock count mismatch, reorder fear, clearance sales, and margin drops',
        caption: 'The five most reliable signals of dead inventory accumulation.',
      },
      {
        type: 'callout',
        text: 'Sign 1: You have shelf space that used to be full and is still full three weeks later',
      },
      {
        type: 'paragraph',
        text: 'Every retailer has a sense of which SKUs are slow. The signal worth acting on is not a product that has always been slow — it is a product that used to move and stopped. If a shelf space that was consistently replenished is now sitting at the same count for three or more weeks, that is not a temporary pause. That is a trend. And trends that go unaddressed become dead stock.',
      },
      {
        type: 'paragraph',
        text: 'The action: pull the sales history on that SKU for the last 12 weeks. If velocity has dropped meaningfully and you have more than 6-8 weeks of supply on hand, initiate a mark-down conversation now — before it becomes a clearance problem at end of season.',
      },
      {
        type: 'callout',
        text: 'Sign 2: Your stock count is regularly different from what your POS says it should be',
      },
      {
        type: 'paragraph',
        text: 'Small stock count discrepancies are normal — mis-picks, return logging errors, a breakroom snack that walks out. Large, consistent discrepancies are a different problem. If your actual count is regularly 10-15% higher than what your POS shows, it means products are leaving your system without being sold. They are either being lost, stolen, or — most commonly — being returned to inventory but logged to the wrong SKU.',
      },
      {
        type: 'paragraph',
        text: 'The result either way is the same: you reorder based on a phantom inventory position that does not exist. You over-order, the dead stock accumulates, and the cycle continues.',
      },
      {
        type: 'paragraph',
        text: 'Coodra flags SKUs with anomalous movement — the ones where your count and your sales history tell different stories. <a href="/integrations">See how inventory reconciliation works with your POS</a>.',
      },
      {
        type: 'callout',
        text: 'Sign 3: You are afraid to reorder some products because you are not sure they are selling',
      },
      {
        type: 'paragraph',
        text: 'This is the behavioral signal. If your buyers — whether it is the owner or a purchasing manager — have a mental block on reordering certain SKUs because they are not confident in the data, that uncertainty is itself a symptom. It means the sales signals are noisy or contradictory. And noisy signals lead to under-ordering on things that are actually selling while over-ordering on things that are not.',
      },
      {
        type: 'paragraph',
        text: 'The fix is not more intuition. It is cleaner data: a weekly sales velocity per SKU that your team can trust, reviewed consistently, so the reorder decision is not a guess but a data point.',
      },
      {
        type: 'callout',
        text: 'Sign 4: Your clearance or mark-down sales are increasing as a percentage of total revenue',
      },
      {
        type: 'paragraph',
        text: 'Every retailer marks down product. The warning sign is when mark-down revenue starts growing faster than total revenue — meaning you are generating a larger share of your sales from discounted product. This is the clearest financial signal that dead stock is accumulating faster than you are clearing it.',
      },
      {
        type: 'paragraph',
        text: 'A healthy ratio for most specialty retailers: mark-down sales should represent no more than 8-12% of total revenue. If it is climbing above that consistently, your buying cycle is running ahead of your actual sell-through. You are ordering more than your store can naturally move.',
      },
      {
        type: 'callout',
        text: 'Sign 5: Your gross margin is declining without a corresponding change in your pricing',
      },
      {
        type: 'paragraph',
        text: 'This is the compound signal. Margin erosion without a pricing change usually has two causes: the cost of your product went up (not a dead stock issue), or you are moving too much inventory at a discount to clear it. The second cause is dead stock behavior, and it compounds because the urgency to clear dead stock leads to discounting that further erodes net margin.',
      },
      {
        type: 'paragraph',
        text: 'If your margin is trending down and you have not changed your pricing or supplier costs, look at your inventory age report. The products with the most weeks of supply on hand are the ones dragging your margin.',
      },
      {
        type: 'paragraph',
        text: 'Coodra <a href="/inventory-management">surfaces the inventory decisions worth acting on every week</a> — including which SKUs are accumulating dead stock before they force a mark-down. <a href="/pricing">See how it works</a>.',
      },
      {
        type: 'paragraph',
        text: 'The retailers who manage inventory best do not have better intuition. They have a weekly review rhythm — a consistent look at what is running, what is stalling, and what needs action before it compounds. The five signals above are your trigger for that review. The question is whether you have a system that surfaces them automatically, or whether you are waiting until they become impossible to miss.',
      },
      {
        type: 'paragraph',
        text: 'The <a href="/blog/inventory-mistakes-that-kill-margin">five compounding inventory mistakes</a> that drive dead stock accumulation follow the same pattern. Knowing the signals is the first step — having a system that acts on them is what protects your margin.',
      },
    ],
  },
  {
    slug: 'reorder-points-without-excel',
    title: 'How to Calculate Reorder Points Without Excel',
    excerpt:
      'The reorder point formula is simple. The hard part is getting the data and applying it consistently. Here is how to do it with your POS data.',
    coverImage: '/images/blog/reorder-points-formula.svg',
    coverImageAlt: 'Reorder point formula for independent retailers without Excel or ERP',
    category: 'Inventory',
    readingTime: '7 min read',
    author: 'Michael Shahid (CEO)',
    publishedAt: 'April 17, 2026',
    isoPublishedAt: '2026-04-17',
    content: [
      {
        type: 'paragraph',
        text: 'The reorder point is one of the most practical concepts in retail inventory management. It tells you exactly when to place a replenishment order so that you do not run out of stock before the new product arrives. Simple in theory. Hard in practice — because most independent retailers do not have a clean way to calculate and track it consistently.',
      },
      {
        type: 'paragraph',
        text: 'This post is about the formula, what each variable means for an independent retailer, and how to apply it without building a spreadsheet that requires an accounting degree to maintain.',
      },
      {
        type: 'image',
        src: '/images/blog/reorder-points-formula.svg',
        alt: 'Reorder point equals average weekly sales times lead time in weeks plus safety stock',
        caption: 'The three variables you need: average weekly sales, supplier lead time, and safety stock.',
      },
      {
        type: 'callout',
        text: 'The reorder point formula',
      },
      {
        type: 'paragraph',
        text: 'Reorder Point = Average Weekly Sales × Lead Time (in weeks) + Safety Stock',
      },
      {
        type: 'paragraph',
        text: 'That is it. Three numbers. The result is the inventory level at which you should trigger your next purchase order — not when the shelf is empty, not when it looks low, but at a specific number that accounts for how long it takes your supplier to get the product to you.',
      },
      {
        type: 'callout',
        text: 'Variable 1: Average weekly sales',
      },
      {
        type: 'paragraph',
        text: 'Pull the total units sold of a SKU over the last 8-12 weeks from your POS. Divide by the number of weeks. That is your average weekly sales for that product.',
      },
      {
        type: 'paragraph',
        text: 'Do not use last week alone — one week is too noisy. A consistent 8-12 week view smooths out the variation from promotions, seasonality, or one-time events. If you are in a seasonal business, use the same season from last year as your primary window.',
      },
      {
        type: 'paragraph',
        text: 'For a product that sells 20 units a week on average, that number is 20.',
      },
      {
        type: 'callout',
        text: 'Variable 2: Lead time in weeks',
      },
      {
        type: 'paragraph',
        text: 'Lead time is the number of weeks between placing your purchase order and the product being available to sell on your shelf. Ask your supplier directly if you are not sure — most will give you a range. Use the longer end of that range for conservative planning.',
      },
      {
        type: 'paragraph',
        text: 'If your supplier says 5-7 days, that is approximately 1 week. If they say 3-4 weeks, use 3 or 4. If it varies by product — which is common when you have multiple vendors — calculate this per product or per vendor group.',
      },
      {
        type: 'paragraph',
        text: 'For a product with a 3-week lead time and 20 units/week average sales, the first part of your calculation is 20 × 3 = 60.',
      },
      {
        type: 'callout',
        text: 'Variable 3: Safety stock',
      },
      {
        type: 'paragraph',
        text: 'Safety stock is your buffer — the extra inventory you hold to protect against unexpected demand spikes or delayed shipments. The simplest safety stock formula for an independent retailer: average weekly sales × 2.',
      },
      {
        type: 'paragraph',
        text: 'Using the same example: 20 units/week × 2 = 40 units of safety stock.',
      },
      {
        type: 'paragraph',
        text: 'Your safety stock is not your reorder quantity. It is the minimum buffer you want to maintain above zero. When your inventory hits 40 units on this example SKU, you reorder — you do not wait until it hits zero.',
      },
      {
        type: 'callout',
        text: 'Putting it together',
      },
      {
        type: 'paragraph',
        text: 'Average weekly sales: 20 units\nLead time: 3 weeks\nSafety stock: 40 units\n\nReorder Point = 20 × 3 + 40 = 100 units',
      },
      {
        type: 'paragraph',
        text: 'When this SKU drops to 100 units on your inventory count, you place your purchase order. You sell through your remaining stock during the 3-week lead time. By the time you hit your safety stock buffer of 40 units, your reorder is arriving. You should never run out.',
      },
      {
        type: 'paragraph',
        text: 'This is the theory. The practice problem is doing it for 300, 500, or 1,000 SKUs without living in a spreadsheet. <a href="/inventory-management">Coodra calculates this for every SKU automatically</a> from your POS sales history, updated weekly, so the reorder decision is not a calculation — it is a review.',
      },
      {
        type: 'callout',
        text: 'Where retailers get this wrong',
      },
      {
        type: 'paragraph',
        text: 'The most common mistake is using last week\'s sales as the average. A single week can be wildly unrepresentative — a big one-off order from a single customer, a local event that drove traffic, a promotion that distorted baseline demand. One week of data tells you almost nothing about consistent velocity.',
      },
      {
        type: 'paragraph',
        text: 'The second mistake is confusing safety stock with reorder quantity. Safety stock is the floor — the point at which you trigger a reorder. Your reorder quantity is how much you order each time. These are two different decisions and should not be the same number.',
      },
      {
        type: 'paragraph',
        text: 'The third mistake: not updating the calculation when supplier lead times change. If your lead time extends from 2 weeks to 4 weeks, your reorder point changes even if sales velocity is the same. Treat lead time as a live variable, not a fixed one.',
      },
      {
        type: 'paragraph',
        text: 'Coodra monitors your top sellers every week and flags when a product is approaching its reorder point before a stockout happens. <a href="/integrations">Connect your POS to get started</a>.',
      },
      {
        type: 'paragraph',
        text: 'For a deeper walkthrough of the five questions your POS can answer every week to support this kind of decision-making, <a href="/blog/how-to-read-pos-data">see our guide to reading POS data</a>. <a href="/blog/demand-forecasting-without-an-erp">Demand forecasting without an ERP</a> covers how to build a reliable demand baseline from your POS data alone — no enterprise software required.',
      },
    ],
  },
  {
    slug: 'coodra-vs-netstock',
    title: 'Coodra vs Netstock: Which Is Right for Independent Retailers?',
    excerpt:
      'Netstock serves mid-market planning teams with ERP integrations and weeks-long onboarding. Coodra is built for independent retailers who want decisions, not dashboards. Here is how they compare.',
    coverImage: '/images/blog/coodra-vs-netstock-comparison.svg',
    coverImageAlt: 'Coodra vs Netstock comparison for independent retailers without ERP',
    category: 'Comparisons',
    readingTime: '8 min read',
    author: 'Michael Shahid (CEO)',
    publishedAt: 'April 17, 2026',
    isoPublishedAt: '2026-04-17',
    content: [
      {
        type: 'paragraph',
        text: 'Netstock is one of the most visible names in inventory optimization for SMB and mid-market businesses. If you are researching inventory planning tools, you have probably found their content, their benchmark reports, and their comparison pages. They are good at being found.',
      },
      {
        type: 'paragraph',
        text: 'This post is not about declaring a winner. It is about being direct about where each product fits and who it actually serves — so you can make the right decision for your store.',
      },
      {
        type: 'image',
        src: '/images/blog/coodra-vs-netstock-comparison.svg',
        alt: 'Side-by-side comparison of Coodra and Netstock across key features for independent retailers',
        caption: 'Key differences between Coodra and Netstock for independent retailers.',
      },
      {
        type: 'callout',
        text: 'Who Netstock is built for',
      },
      {
        type: 'paragraph',
        text: 'Netstock is an inventory optimization platform designed for businesses with existing ERP systems — NetSuite, Sage, Microsoft Dynamics, SAP Business One, and similar enterprise platforms. Their product assumes you have clean, structured inventory data inside an ERP, a dedicated person or team doing planning, and a multi-week implementation process to get the system configured.',
      },
      {
        type: 'paragraph',
        text: 'If that describes your business, Netstock is worth evaluating seriously. Their demand forecasting, S&OP tooling, and supplier performance features are built for that operational complexity.',
      },
      {
        type: 'paragraph',
        text: 'If it does not describe your business — if you are running Shopify or Square, have one to five locations, and are making inventory decisions between serving customers, Netstock\'s feature set is designed for a different problem than the one you have.',
      },
      {
        type: 'callout',
        text: 'Who Coodra is built for',
      },
      {
        type: 'paragraph',
        text: 'Coodra is built for independent retailers who do not have an ERP and do not want one. You connect your POS — Shopify, Square, Lightspeed, or Clover — and Coodra turns your sales and inventory data into a weekly ranked list of inventory decisions: what to reorder, what to reduce, what to hold.',
      },
      {
        type: 'paragraph',
        text: 'There is no ERP required, no implementation project, no dedicated planner needed. The outcome is the same — better inventory decisions — but the path there is designed for a smaller, faster-moving business.',
      },
      {
        type: 'callout',
        text: 'Setup and time to value',
      },
      {
        type: 'paragraph',
        text: 'Netstock\'s implementation typically involves an ERP integration, data mapping, and a planning process that takes weeks to months to fully configure. For businesses that already have the ERP infrastructure in place, this is part of the cost of doing business. For independent retailers who do not have that infrastructure, it is a significant investment before seeing any value.',
      },
      {
        type: 'paragraph',
        text: 'Coodra connects directly to your POS with no ERP dependency. Most retailers are live and receiving their first set of recommendations within one business day. The time from signing up to seeing a ranked inventory decision list is measured in hours, not weeks.',
      },
      {
        type: 'paragraph',
        text: 'For a full side-by-side view of how Coodra and other alternatives compare on features, pricing, and setup time, <a href="/comparisons">see the comparison table</a>.',
      },
      {
        type: 'callout',
        text: 'Pricing transparency',
      },
      {
        type: 'paragraph',
        text: 'Netstock does not publish pricing on their website — it requires a demo request and a sales conversation. For a business evaluating options quickly, this is a friction point. You cannot easily compare cost without committing to a conversation first.',
      },
      {
        type: 'paragraph',
        text: 'Coodra publishes pricing on the website. You can evaluate whether the plan fits your store\'s volume without speaking to anyone. <a href="/pricing">See Coodra pricing</a>.',
      },
      {
        type: 'callout',
        text: 'The independent retailer question',
      },
      {
        type: 'paragraph',
        text: 'If you are an independent retailer — jewelry, pet supply, pharmacy, grocery, specialty retail — and you are running Shopify, Square, or Lightspeed, the honest answer to "is Netstock right for me?" is: probably not in its current form. Netstock\'s market positioning, pricing structure, and product complexity are all built around ERP-first businesses.',
      },
      {
        type: 'paragraph',
        text: 'That does not mean Netstock is a bad product. It means they are solving a different problem. The question is whether that problem is the one you actually have.',
      },
      {
        type: 'paragraph',
        text: 'Coodra was built specifically for independent retailers who have a POS, have sales data, and want to make better inventory decisions without adding enterprise software. <a href="/case-studies">See how retailers have caught inventory problems before they compound</a>. If that is your situation, <a href="/signup">start your free trial</a> and see what your POS data has been telling you.',
      },
    ],
  },
  {
    slug: 'how-to-read-pos-data',
    title: 'How to Read Your POS Data to Make Smarter Buying Decisions',
    excerpt:
      'Your POS logs everything you need — sales velocity, stock position, demand trends. Here is how to turn transaction data into a weekly buying strategy without a spreadsheet.',
    coverImage: '/images/blog/pos-data-buying-decisions.svg',
    coverImageAlt: 'How to read POS data for smarter retail buying decisions',
    category: 'Inventory',
    readingTime: '7 min read',
    author: 'Michael Shahid (CEO)',
    publishedAt: 'April 17, 2026',
    isoPublishedAt: '2026-04-17',
    content: [
      {
        type: 'paragraph',
        text: 'Every transaction your POS processes is a data point. Most independent retailers never look at it beyond confirming the sale went through. That is a significant missed opportunity — because the data your POS generates every week contains everything you need to make better, more confident buying decisions.',
      },
      {
        type: 'paragraph',
        text: 'This is not about building dashboards. It is about knowing which five questions to ask your POS data every week, and knowing where to find the answers.',
      },
      {
        type: 'image',
        src: '/images/blog/pos-data-buying-decisions.svg',
        alt: 'POS data sources on the left, weekly buying decisions on the right',
        caption: 'Your POS already captures the data. The question is whether you are using it.',
      },
      {
        type: 'callout',
        text: 'The five questions your POS can answer every week',
      },
      {
        type: 'paragraph',
        text: 'These are the questions that separate retailers who manage inventory by instinct from retailers who manage it by data. You do not need a BI tool or a spreadsheet to answer any of them — most POS systems surface all of this in their reporting sections.',
      },
      {
        type: 'callout',
        text: 'Question 1: What sold the most, compared to last week and last month?',
      },
      {
        type: 'paragraph',
        text: 'Most POS systems have a "top sellers" or "sales by item" report. Run it for the last 7 days and compare it to the prior 7-day period. Look for products that have moved into the top 20% by units sold — that is a velocity signal. It means something changed: a new customer type found it, a display drove attention, or seasonal demand shifted.',
      },
      {
        type: 'paragraph',
        text: 'Acting on this signal does not mean doubling your order. It means making sure you do not under-order the same product this cycle and run out at the worst moment. <a href="/integrations">Coodra tracks this automatically every week</a> and flags products that are trending up before you miss a reorder window.',
      },
      {
        type: 'callout',
        text: 'Question 2: What is my current stock position per SKU, and which SKUs are below my reorder point?',
      },
      {
        type: 'paragraph',
        text: 'Your POS knows your on-hand inventory by SKU. The question is whether you are checking it before you reorder. Most retailers order when the shelf is empty — not when the data says it will be empty in 10 days.',
      },
      {
        type: 'paragraph',
        text: 'The fix: run an inventory by item report once a week. Sort by quantity on hand, ascending. The SKUs at the bottom are your most urgent replenishment needs. Cross-reference with your sales velocity — a SKU at 10 units with a 3-unit-per-week velocity needs a reorder now. A SKU at 10 units with a 0.5-unit-per-week velocity does not.',
      },
      {
        type: 'paragraph',
        text: '<a href="/blog/reorder-points-without-excel">How to calculate reorder points without a spreadsheet</a> — and how to apply them consistently across your top SKUs.',
      },
      {
        type: 'callout',
        text: 'Question 3: Which products sold faster this week than the prior 4-week average?',
      },
      {
        type: 'paragraph',
        text: 'This is a demand trend question. One week is noisy. Four weeks gives you a pattern. Products selling at twice their 4-week average are telling you something: a trend is forming, or a supply constraint is about to bite.',
      },
      {
        type: 'paragraph',
        text: 'Acting on this signal early — before the shortage becomes a stockout — is one of the highest-value inventory decisions you can make. The retailers who never run out of their best sellers are the ones who are watching velocity trends, not just stock counts.',
      },
      {
        type: 'callout',
        text: 'Question 4: What is my sell-through rate by category?',
      },
      {
        type: 'paragraph',
        text: 'Sell-through rate = units sold ÷ units received in a given period. Run this by category — not by total store — every 4 weeks. It tells you which categories are performing and which are accumulating inventory relative to the volume you are bringing in.',
      },
      {
        type: 'paragraph',
        text: 'A category with a 15% sell-through over 30 days is a warning sign: you are bringing in far more than you are moving. A category with a 60% sell-through is healthy — inventory is turning and you are likely not holding excess.',
      },
      {
        type: 'paragraph',
        text: 'This question is especially important before you place a large purchase order. If a category has been trending at 20% sell-through, adding more inventory will not fix it. <a href="/pricing">See how Coodra surfaces category health every week</a>.',
      },
      {
        type: 'callout',
        text: 'Question 5: What is my best-seller mix by revenue versus by units?',
      },
      {
        type: 'paragraph',
        text: 'These are different lists. Your top sellers by units might be low-ticket items — a $5 accessory that moves 20 units a week. Your top sellers by revenue might be $200 pieces that move 2 units a week. Both matter. But they tell you different things.',
      },
      {
        type: 'paragraph',
        text: 'The units list tells you what drives traffic and repeat visits. The revenue list tells you what pays the bills. A healthy store has products in both lists. If your revenue list is full of items that are also your slowest movers by velocity, you have a margin mix problem that no amount of traffic will solve.',
      },
      {
        type: 'paragraph',
        text: 'The weekly review does not need to take more than 20 minutes. Pull the five reports above, note the three most important changes, and act on the one decision that has the highest margin impact. That is the discipline. Everything else is detail.',
      },
      {
        type: 'paragraph',
        text: 'Coodra consolidates all five questions into <a href="/inventory-management">a single weekly view</a> — your top movers, your reorder flags, your slow categories, and your velocity trends — pulled automatically from your POS. <a href="/signup">Connect your POS once</a> and get the weekly view without running a single report manually.',
      },
      {
        type: 'paragraph',
        text: 'If you are evaluating whether your POS data is clean enough to trust for these decisions, <a href="/blog/pos-data-trust-guide">this guide covers how to assess signal quality</a> before you act on any single data point.',
      },
    ],
  },
  {
    slug: 'stock-to-sales-ratio-guide',
    title: 'The Stock-to-Sales Ratio: The Simple Metric Most Independent Retailers Skip',
    excerpt:
      'It tells you how many days of inventory you have on hand at any given time. Lower is better. Most retailers do not track it — and pay for it in margin.',
    coverImage: '/images/blog/stock-to-sales-ratio.svg',
    coverImageAlt: 'Stock-to-sales ratio guide for independent retailers showing healthy, caution, and danger zones',
    category: 'Inventory',
    readingTime: '6 min read',
    author: 'Michael Shahid (CEO)',
    publishedAt: 'April 17, 2026',
    isoPublishedAt: '2026-04-17',
    content: [
      {
        type: 'paragraph',
        text: 'The stock-to-sales ratio is one of the simplest and most useful metrics in retail. It answers one question: how long does inventory sit in my store before it sells? Lower is better — because inventory that sits ties up capital, takes up shelf space, and eventually forces a discounted clearance.',
      },
      {
        type: 'paragraph',
        text: 'Most independent retailers do not track it. They track sell-through in vague terms ("we moved a lot of that") and they track inventory levels in the same vague terms ("we have a lot of that in the back"). The stock-to-sales ratio makes the conversation precise.',
      },
      {
        type: 'image',
        src: '/images/blog/stock-to-sales-ratio.svg',
        alt: 'Stock-to-sales ratio formula with healthy, caution, and danger zone examples',
        caption: 'The ratio reveals where your capital is sitting — and for how long.',
      },
      {
        type: 'callout',
        text: 'How to calculate it',
      },
      {
        type: 'paragraph',
        text: 'Stock-to-Sales Ratio = Average Inventory on Hand ÷ Net Sales (units or dollars)',
      },
      {
        type: 'paragraph',
        text: 'To get your average inventory on hand: take the beginning and ending inventory count for a period (your POS can give you this), add them, divide by 2. Then divide your net sales for that period by that average.',
      },
      {
        type: 'paragraph',
        text: 'The result is a multiplier. A ratio of 2.0x means you have approximately twice your average weekly sales in inventory on hand — or about 14 days of supply at current velocity. A ratio of 4.0x means you have roughly 28 days of supply. The higher the number, the longer inventory sits.',
      },
      {
        type: 'callout',
        text: 'What the numbers mean in practice',
      },
      {
        type: 'paragraph',
        text: 'For most specialty retail categories, a healthy stock-to-sales ratio is between 1.5x and 2.5x — meaning you have roughly 10-18 days of supply on hand at any given time. This is low enough that inventory is turning fast and you are not holding excess, but high enough that you have buffer to handle a week of unexpectedly strong traffic.',
      },
      {
        type: 'paragraph',
        text: 'A ratio between 2.5x and 4.0x is a caution zone. Inventory is sitting longer than ideal. You are probably ordering too much relative to your sell-through rate. At this ratio, you want to start reducing order quantities and watching for products that are clearly dead weight.',
      },
      {
        type: 'paragraph',
        text: 'A ratio above 4.0x is a danger zone. This is where dead stock compounds. You are holding more than four weeks of supply, which means you have products on your shelves that are not selling at a rate that justifies the capital. At this ratio, markdowns are coming, and they will hurt more because the inventory has been sitting long enough that it may be seasonally stale by the time you clear it.',
      },
      {
        type: 'paragraph',
        text: '<a href="/blog/dead-inventory-signs">Five signs your store has too much dead inventory</a> — including what to look for before the ratio climbs this high.',
      },
      {
        type: 'callout',
        text: 'Calculate it by category, not just store-wide',
      },
      {
        type: 'paragraph',
        text: 'A store-wide ratio hides problems. Your overall stock-to-sales might be 2.2x — healthy — while your jewelry category is at 5.1x and your accessories category is at 1.1x. The store-wide number makes the jewelry problem invisible.',
      },
      {
        type: 'paragraph',
        text: 'Calculate the ratio by category every 4 weeks. This is where the metric becomes genuinely actionable. A category running at 4.5x tells you to reduce incoming orders on that category, accept that some markdowns may be coming, and stop buying at the same rate until the ratio improves.',
      },
      {
        type: 'callout',
        text: 'The connection to buying decisions',
      },
      {
        type: 'paragraph',
        text: 'Your stock-to-sales ratio should directly influence your purchase order size. When you are entering a new season or receiving a new shipment, look at your current ratio by category before confirming the order. If the category is already at 3.5x, adding more inventory will push it higher. The smarter move is to wait — let the existing inventory turn before adding more.',
      },
      {
        type: 'paragraph',
        text: 'This is the discipline that separates retailers with healthy cash flow from retailers who are constantly over-extended on inventory. It is not about buying less. It is about buying at the right time in the cycle.',
      },
      {
        type: 'paragraph',
        text: '<a href="/inventory-management">Coodra tracks your stock-to-sales ratio per category automatically</a> and flags when a category drifts into the caution or danger zone — before it becomes dead stock. <a href="/integrations">See it connected to your POS data</a>.',
      },
    ],
  },
  {
    slug: 'demand-forecasting-without-an-erp',
    title: 'Demand Forecasting Without an ERP: What Independent Retailers Can Actually Do',
    excerpt:
      'Most inventory forecasting tools assume you have an ERP, a data team, and years of clean records. Here is what independent retailers can do with the data they already have.',
    coverImage: '/images/blog/demand-forecasting-erp.jpg',
    coverImageAlt: 'Retailer reviewing POS data on a tablet',
    category: 'Demand Forecasting',
    readingTime: '6 min read',
    author: 'Michael Shahid (CEO)',
    publishedAt: 'April 18, 2026',
    isoPublishedAt: '2026-04-18',
    content: [
      {
        type: 'paragraph',
        text: 'Most inventory forecasting tools were designed for companies that already have ERP systems. The pitch is compelling: let our software predict your demand, automate your replenishment, and eliminate stockouts. What the pitch leaves out is the prerequisite: you need clean, structured, historical data that most independent retailers do not have.',
      },
      {
        type: 'paragraph',
        text: 'If you run a jewelry store, a pet supply shop, or a specialty grocery, you probably do not have 24 months of organized SKU-level sell-through data. You have your POS data — pulled from Shopify, Square, Lightspeed, or Clover — and whatever you have manually tracked in spreadsheets. That is not nothing. But it is also not an ERP.',
      },
      {
        type: 'paragraph',
        text: 'Here is the good news: you do not need an ERP to forecast demand better than you currently are. You need two things. Enough clean signal. And a consistent process to review it.',
      },
      {
        type: 'callout',
        text: 'The ERP assumption gap in inventory software',
      },
      {
        type: 'paragraph',
        text: 'The gap between what enterprise forecasting tools expect and what independent retailers actually have is significant. ERP systems maintain continuous, SKU-level inventory and sales records with accurate cost data, supplier lead times, and seasonal adjustments. Most independent retailers have none of that in a structured form.',
      },
      {
        type: 'paragraph',
        text: 'When you buy a forecasting tool that assumes ERP data, you end up spending the first three months cleaning up imports, correcting SKU mismatches, and building the infrastructure the software was designed to work with. By the time you are ready to forecast, you have spent more time on data preparation than on any actual decision.',
      },
      {
        type: 'paragraph',
        text: 'Coodra was built to work with POS data directly — Shopify, Square, Lightspeed, Clover, Moneris — without requiring a data team or a months-long onboarding. <a href="/integrations">See how the POS connection works</a>.',
      },
      {
        type: 'callout',
        text: 'Signal 1: Weekly sales velocity per SKU',
      },
      {
        type: 'paragraph',
        text: 'The foundation of any demand forecast — ERP or no ERP — is a reliable weekly sales velocity per SKU. Not last month\'s total. Not what you vaguely remember selling. Weekly velocity: units sold per SKU per week, calculated over a rolling 4-to-6-week window.',
      },
      {
        type: 'paragraph',
        text: 'This is the number that tells you what demand actually looks like right now, not three months ago. A SKU that averaged 3 units a week over the last month is in a different demand position than one that averaged 3 units a week over the last quarter — the recent window matters more for planning the next reorder.',
      },
      {
        type: 'paragraph',
        text: 'Coodra calculates this automatically for every SKU in your POS, updated weekly. <a href="/inventory-management">See the demand signals Coodra surfaces for every product</a>.',
      },
      {
        type: 'callout',
        text: 'Signal 2: Seasonal position — same period last year',
      },
      {
        type: 'paragraph',
        text: 'Most independent retailers skip seasonal analysis because they think it requires statistical expertise. It does not. It requires pulling the same period from last year.',
      },
      {
        type: 'paragraph',
        text: 'What did you sell in April last year? Your POS almost certainly has that data. Compare it to this April. If you sold 140 units in April 2025 and 115 units in April 2026, that is a 18% demand decline in the same seasonal period — not explained by a one-time promotion or a new competitor opening. That is signal worth acting on before you place your next purchase order.',
      },
      {
        type: 'paragraph',
        text: 'You do not need a statistical model for this. You need last year\'s POS report and a basic spreadsheet. The model is a comparison. The insight is whether your current year is tracking above, below, or in line with last year\'s seasonal pattern.',
      },
      {
        type: 'callout',
        text: 'Signal 3: Category-level trend direction',
      },
      {
        type: 'paragraph',
        text: 'SKU-level forecasting is noisy for low-velocity products. If you sell 3 units of a SKU per week, any single week\'s data is almost random. Category-level trends are more stable and more useful for high-level buying decisions.',
      },
      {
        type: 'paragraph',
        text: 'If your accessories category is running 12% ahead of last year while your jewelry category is running 4% behind, that is meaningful signal for how to allocate your next purchase budget — even without knowing exactly which specific SKU within jewelry is underperforming.',
      },
      {
        type: 'paragraph',
        text: 'Coodra tracks category-level performance automatically and flags when a category is trending meaningfully above or below its prior-year position.',
      },
      {
        type: 'callout',
        text: 'The real reason demand forecasting fails: lead time',
      },
      {
        type: 'paragraph',
        text: 'Most demand forecasting mistakes are not actually forecasting errors. They are lead-time errors. When you place a purchase order with a 3-week lead time, you are not forecasting what demand looks like right now. You are forecasting what demand will look like 3 weeks from now. Most retailers are accidentally forecasting their current inventory position — what they think they have on hand — rather than what demand will do while they wait for the order to arrive.',
      },
      {
        type: 'paragraph',
        text: 'The fix is not a better forecast. It is knowing your true replenishment cycle: how long from order to receipt, including the time it takes to process, receive, and put away stock. If your effective lead time is 4 weeks and your safety stock only covers 1 week, you are under-buffered for every single reorder cycle, guaranteed.',
      },
      {
        type: 'paragraph',
        text: 'Coodra calculates per-SKU safety stock based on your actual lead time and your sales velocity — automatically, from your POS data. <a href="/inventory-management">See how the reorder point calculation works</a>.',
      },
      {
        type: 'callout',
        text: 'The 90-day demand baseline',
      },
      {
        type: 'paragraph',
        text: 'If you only have one number to track, track a 90-day rolling average of weekly sales per SKU. Ninety days smooths out the noise from a single slow week or a promotional spike, while still being recent enough to reflect actual demand trends rather than seasonal patterns that may have shifted.',
      },
      {
        type: 'paragraph',
        text: 'Thirty days is too short for most retail products — one slow week can make a 2-unit-per-week SKU look like a 1-unit-per-week SKU. Six months is too long if you have changed your product mix, moved locations, or had a competitor open nearby.',
      },
      {
        type: 'paragraph',
        text: 'The 90-day average is most reliable for products that sell at least 4 units per week consistently. For slower-moving SKUs, your signal-to-noise ratio is lower regardless of what tool you use. The practical advice: track it, but trust it less, and lean toward supplier minimums as your reorder quantity.',
      },
      {
        type: 'paragraph',
        text: 'This is not a perfect system. No demand forecast is. But it is better than reordering on instinct, and it is more reliable than extrapolating from a single month of data. The gap between what independent retailers are doing now and what they could be doing with this approach is significant.',
      },
      {
        type: 'paragraph',
        text: '<a href="/inventory-management">Coodra builds a 90-day demand baseline automatically from your POS data</a> and uses it to generate reorder recommendations that account for lead time, seasonal position, and velocity trend — without requiring an ERP, a data team, or a manual spreadsheet. <a href="/signup">Start free and connect your POS in 5 minutes</a>.',
      },
    ],
  },
]

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}
