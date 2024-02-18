
system_program::create_account(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        system_program::CreateAccount {
            from: ctx.accounts.signer.to_account_info(),
            to: ctx.accounts.token_meta_data.to_account_info(),
        },
    ),
    lamports_required,
    space as u64,
    &ctx.program_id,
)?;

let update_authority = OptionalNonZeroPubkey::try_from(Some(*ctx.accounts.signer.key))?;

let token_metadata = TokenMetadata {
    name: "Epic Fish".to_string(),
    symbol: "EPC".to_string(),
    uri: "https://shdw-drive.genesysgo.net/AzjHvXgqUJortnr5fXDG2aPkp2PfFMvu4Egr57fdiite/PirateCoinMeta".to_string(),
    update_authority: update_authority,
    mint: *ctx.accounts.mint.key,
    ..Default::default()
};
let instance_size = get_instance_packed_len(&token_metadata)?;

// allocate a TLV entry for the space and write it in
let mut buffer = ctx.accounts.token_meta_data.try_borrow_mut_data()?;
let mut state = TlvStateMut::unpack(&mut buffer)?;
state.alloc::<TokenMetadata>(instance_size, false)?;
state.pack_first_variable_len_value(&token_metadata)?;
    